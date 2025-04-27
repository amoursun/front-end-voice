import { BaseSource } from './base-source';
import { ImgSource, ImgSourceOption } from './img-source';
import { TextSourceOption, TextSource } from './text-source';
import { VideoSource, VideoSourceOption } from './video-source';

export { BaseSource };
export type { TextSourceOption };
export type { ImgSourceOption };
export type { VideoSourceOption };

export function createSource(
    sourceOption: TextSourceOption | ImgSourceOption | VideoSourceOption
): BaseSource {
    if ((sourceOption as TextSourceOption).text) {
        return new TextSource(sourceOption as TextSourceOption);
    } else if ((sourceOption as ImgSourceOption).img) {
        return new ImgSource(sourceOption as ImgSourceOption);
    } else if ((sourceOption as VideoSourceOption).video) {
        return new VideoSource(sourceOption as VideoSourceOption);
    }
    throw new TypeError('invalid source options');
}
