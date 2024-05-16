import {useState, useEffect, useMemo, useRef} from 'react';
import {createWorker} from 'tesseract.js';
import style from './style.module.scss';
import {Input} from 'antd';
import engPng from './images/eng.png';
import chiSimPng from './images/chi_sim.png';
import {getId} from '../../utils/util-get-id';

const images: string[] = [
  engPng,
  chiSimPng,
];
interface IResult {
  id: string;
  name: string;
  src: string;
  keyword: string;
  error?: any;
}
export function SearchImageText() {
  const [value, setValue] = useState('');
  const workerRef = useRef<Tesseract.Worker>();
  const [imageValues, setImageValues] = useState<IResult[]>([]);
  useEffect(() => {
    const requestImg = (item: Pick<IResult, 'name' | 'src' | 'id'>): Promise<IResult> => {
      if (!workerRef.current) {
        return Promise.reject({...item, keyword: item.src, error: 'worker not init'});
      }
      return workerRef.current.recognize(item.src)
        .then(({data: {text}}) => {
          return {...item, keyword: text};
        })
        .catch(err => {
          return {...item, keyword: item.src, error: err};
        });
    };
    const request = async () => {
      /**
       * eng: 英文
       * chi_sim: 简体中文
       * [eng, chi_sim]: 英文和简体中文
       * createWorker('eng')
       * createWorker([eng, chi_sim]) | eng+chi_sim]
       */
      workerRef.current = await createWorker(['eng', 'chi_sim']);
      const data = await Promise.all(
        images
          .map(img => ({name: img, src: img, id: getId()}))
          .map(requestImg)
      );
      setImageValues(data);
    };
    request();
  }, [workerRef]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const searchImages = useMemo(() => {
    if (!value) {
      return imageValues;
    }
    return imageValues.filter(item => item.keyword.includes(value));
  }, [imageValues, value]);
  console.log(searchImages, 'searchImages');
  return (
    <div className={style.searchImageText}>
      <Input value={value} onChange={handleChange} />
      <div className={style.imgContainer}>
        {searchImages.map((item) => {
          return <img src={item.src} key={item.id} />
        })}
      </div>
    </div>
  )
}

export default SearchImageText;
