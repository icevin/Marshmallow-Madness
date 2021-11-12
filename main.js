import {defs, tiny} from './examples/common.js';


const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Texture, Material, Scene,
} = tiny;

export class MarshmallowMadness extends Scene {
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            box: new defs.Cube(),
            torus: new defs.Torus(15, 15),
            cup: new defs.Capped_Cylinder(30, 30),
            marshmallow: new defs.Rounded_Capped_Cylinder(10, 10),
            table: new defs.Square()
        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .5, diffusivity: 1, color: hex_color("#ffffff")}),
            table_material: new Material(new defs.Textured_Phong(1), {ambient: .9, texture: new Texture("assets/wood.jpg")}),
        }


        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 50), vec3(0, -10, 0), vec3(0, 1, 0));
    }

    make_control_panel() {};

    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        const light_position = vec4(10, 10, 10, 1);
        // The parameters of the Light are: position, color, size
        program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 100)];

        let table_scale = Mat4.identity().times(
            Mat4.translation(0, -10, 0)).times(
            Mat4.rotation(1.57079633, 1, 0, 0)).times(
            Mat4.scale(20, 40, 1));
        this.shapes.table.draw(context, program_state, table_scale, this.materials.table_material);

        //let cups_transform = Mat4.identity();
        let cups_transform = Mat4.identity().times(
            Mat4.translation(0, -6.5, -20)).times(Mat4.rotation(1.57079633, -1, 0, 0));

        cups_transform = cups_transform.times(Mat4.scale(3, 3, 7));
        
        for (let i = 1; i < 5; i++) {
            for (let j = 0; j < i; j++) {
                this.shapes.cup.draw(context, program_state, cups_transform, this.materials.test);
                cups_transform = cups_transform.times(Mat4.translation(1.8, 0, 0));
            }
            cups_transform = cups_transform.times(Mat4.translation(-1.8 * (i + 0.5), 1.8, 0));
        }

        let axis_transform = Mat4.identity().times(Mat4.translation(0, 0, 38));
        this.shapes.box.draw(context, program_state, axis_transform.times(Mat4.scale(10, .1, .1)), this.materials.test.override({color: color(1, 0, 0, 1)}));
        this.shapes.box.draw(context, program_state, axis_transform.times(Mat4.scale(.1, 10, .1)), this.materials.test.override({color: color(0, 1, 0, 1)}));
        this.shapes.box.draw(context, program_state, axis_transform.times(Mat4.scale(.1, .1, 10)), this.materials.test.override({color: color(0, 0, 1, 1)}));

        let marshmallow_scale = Mat4.identity().times(Mat4.scale(1, 1, 1.9)).times(Mat4.translation(0, 0, 20));
        this.shapes.marshmallow.draw(context, program_state, marshmallow_scale, this.materials.test);


    }
}