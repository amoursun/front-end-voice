import { generateList } from "../../method";
import Vlist from "./v-list";

const data = generateList({
    isAuto: true,
});

const userVisibleHeight = 400;
const estimateRowHeight = 80;
const bufferSize = 5;

export default function dummyComp() {
  return (
    <Vlist
      height={userVisibleHeight}
      total={data.length}
      estimateRowHeight={estimateRowHeight}
      bufferSize={bufferSize}
      rowRenderer={(index: number, styleData: any) => {
        const item = index;
        return (
          <div
            key={item}
            style={{
                width: '50%',
                padding: '20px',
                borderBottom: '1px solid #000',
                ...styleData,
            }}
            onClick={() => {
              console.log("item-", index);
            }}
            id={`item-${index}`}
          >
            <span
              style={{
                display: 'block',
                color: 'rgba(0, 0, 0, 0, 85)',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Item - {data[index].id} Data:
            </span>
            <span
              style={{
                width: '100%',
                color: 'rgba(0, 0, 0, 0.5)',
                fontSize: 16,
              }}
            >
              {data[index].value}
            </span>
          </div>
        );
      }}
    />
  );
}
