import axios from 'axios';
import fetch from 'isomorphic-fetch';
import dataUriToBuffer from 'data-uri-to-buffer';

export default class FileUtils {
	public static async loadArrayBufferFromUri(uri: string): Promise<ArrayBuffer> {
		if (uri.startsWith('data:')) {
			if (typeof window !== 'undefined') {
				return fetch(uri).then(blob => blob.arrayBuffer());
			} else {
				return dataUriToBuffer(uri);
			}
		}
		return axios.get(uri);
	}

	public static async loadBlobFromUri(uri: string): Promise<Blob> {
		return axios.get(uri);
	}

	public static async loadImageFromUri(uri: string): Promise<ImageBitmap> {
		return createImageBitmap(await this.loadBlobFromUri(uri));
	}
}
