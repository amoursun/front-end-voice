import {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import cx from 'classnames';
import {Button, Select, Slider} from 'antd';
import {PlayCircleOutlined, PauseCircleOutlined} from '@ant-design/icons';
import style from './style.module.scss';
import {getTime} from './method';
import {audioList, IAudioItem} from '../mp3';

interface Props {
  className?: string;
}

function createTime(max?: number) {
  return {
    minute: '00',
    second: '00',
    width: '0%',
    max: max || 0,
    min: 0,
  };
}
export const AudioItem: React.FC<Props> = (props) => {
  const {className} = props;
  const [video, setVideo] = useState(audioList[0]);
  const [slider, setSlider] = useState(0);
  const audioRef = useRef<HTMLVideoElement>(null);
  const constantRef = useRef<{timer: NodeJS.Timeout}>({
    timer: null,
  });
  const [play, setPlay] = useState(false);
  const [time, setTime] = useState(createTime());

  // 音频控制播放/暂停
  const handlePlay = (isPlay?: boolean) => {
    if (typeof isPlay === 'undefined') {
      isPlay = !play;
    }
    setPlay(isPlay);
    const audio = audioRef.current;
    if (!audio) return;
    clearTimeout(constantRef.current.timer);
    if (isPlay) {
      audio.play();
      constantRef.current.timer = setInterval(() => {
        const currentTime = Math.floor(audio.currentTime);
        const duration = Math.floor(audio.duration);
        const value = (currentTime / duration) * 100;
        const {minute, second} = getTime(currentTime);
        setTime(state => ({
            ...state,
            minute,
            second,
            width: `${value.toFixed(2)}%`,
        }));
        setSlider(currentTime);
      }, 1000);
    }
    else {
      audio.pause();
    }
  };
  const handleSlider = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setSlider(value);
    audio.currentTime = value;
  };
  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setTime(createTime(Math.floor(audio.duration)));
  };
  const handleSelectVideo = (video: IAudioItem) => {
    setVideo(video);
    setTime(createTime());
    setSlider(0);
    handlePlay(false)
  };
  // useEffect(() => {
  // }, [audioRef]);

  
  return (
    <div className={cx(style.audioTime, className)}>
      <Button
        shape="circle"
        icon={play ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        onClick={() => handlePlay()}
      />
      <div className={style.playBox}>
        <div className={style.info}>{time.minute}:{time.second}</div>
        
        <div className={style.timeline}>
          <Slider
            min={time.min}
            max={time.max}
            step={1}
            onChange={handleSlider}
            value={slider}
            tooltip={{
              open: false,
            }}
          />
        </div>
        <Select
          value={video.value}
          options={audioList}
          onChange={(_, opt) => handleSelectVideo(opt as IAudioItem)}
        />
      </div>
      <div className={style.video}>
        <video
          controls
          autoPlay
          key={video.value}
          ref={audioRef}
          className={style.video}
          onPlay={() => handlePlay(true)}
          onLoadedMetadata={onLoadedMetadata}
        >
          <source src={video.url} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};