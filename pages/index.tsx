import classNames from 'classnames';
import PlayingCard from '../components/PlayingCard';
import { Rank } from '../types/Rank';
import { Suit } from '../types/Suit';

export default function Home() {
  return (
    <div className={classNames('flex justify-center items-center')}>
      <PlayingCard rank={Rank.Queen} suit={Suit.Heart} />
    </div>
  );
}
