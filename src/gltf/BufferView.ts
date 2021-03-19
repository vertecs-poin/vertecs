import Buffer from './Buffer';

interface BufferViewOptions {

}

export default class BufferView {
	public byteLength: number;

	public constructor(buffer: Buffer, byteLength: number, options?: BufferViewOptions) {
		throw new Error('Not yet implemented');
	}

	public static fromJson(json: any): any {

	}
}
