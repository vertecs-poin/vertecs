import {Component} from '../ecs';
import {mat4, quat, vec3} from 'gl-matrix';

export default class Transform extends Component {

	public translate(translation: vec3) {

	}

	public scaleXYZ(out: vec3) {
		throw new Error("Not yet implemented");
	}

	public rotateXYZ(out: vec3) {
		throw new Error("Not yet implemented");
	}

	public getModelToWorldMatrix(): mat4 {
		throw new Error("Not yet implemented");
	}

	public getWorldRotation(out: quat): quat {
		throw new Error("Not yet implemented");
	}

	public getWorldScale(out: vec3): vec3 {
		throw new Error("Not yet implemented");
	}

	public getWorldPosition(out: vec3): vec3 {
		throw new Error("Not yet implemented");
	}
}
