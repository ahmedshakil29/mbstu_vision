import type { HistoryItem } from '@/types';

interface DetectionLogProps {
  items: HistoryItem[];
}

export default function DetectionLog({ items }: DetectionLogProps) {
  if (items.length === 0) {
    return (
      <div className="history-list">
        <div className="history-empty">No detections yet</div>
      </div>
    );
  }

  return (
    <div className="history-list">
      {items.map((item) => (
        <div key={item.id} className="history-item">
          <span className={`hi-type ${item.isAutistic ? 'autism' : 'normal'}`}>
            {item.isAutistic ? 'AUT' : 'NRM'}
          </span>
          <span className="hi-emo">
            {item.topEmotion} {item.confidence}%
          </span>
          <span className="hi-time">{item.time}</span>
        </div>
      ))}
    </div>
  );
}
// import type { HistoryItem } from '@/types';

// interface DetectionLogProps {
//   items: HistoryItem[];
// }

// export default function DetectionLog({ items }: DetectionLogProps) {
//   if (items.length === 0) {
//     return (
//       <div className="history-list">
//         <div className="history-empty">No detections yet</div>
//       </div>
//     );
//   }

//   return (
//     <div className="history-list">
//       {items.map((item) => (
//         <div key={item.id} className="history-item">
//           <span className={`hi-type ${item.isAutism ? 'autism' : 'normal'}`}>
//             {item.isAutism ? 'AUT' : 'NRM'}
//           </span>
//           <span className="hi-emo">
//             {item.topEmotion} {item.confidence}%
//           </span>
//           <span className="hi-time">{item.time}</span>
//         </div>
//       ))}
//     </div>
//   );
// }
