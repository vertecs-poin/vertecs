import Component from "../../ecs/Component";

export default class Skeleton extends Component {

	public constructor() {
		super();
	}

	public clone(): Component {
		return this;
	}
}
