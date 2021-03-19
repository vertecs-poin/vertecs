import BufferView from './BufferView';

export default class Accessor {

	public static fromJson(json: any, bufferViews: BufferView[]): Accessor {
		throw new Error('Not yet implemented');
	}

	public getDataAsIntegerArray(): number[] {
		throw new Error('Not yet implemented');
	}

	public getDataAsFloatArray(): number[] {
		throw new Error('Not yet implemented');
	}

	public getByteLength(): number {
		throw new Error('Not yet implemented');
	}
}
