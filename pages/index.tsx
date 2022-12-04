import classNames from 'classnames';
import PlayingCardView from '../components/PlayingCardView';
import { PlayingCard } from '../types/playing-card';

export default function Home() {
  const card: PlayingCard = {
    face: 'up',
    rank: 'ace',
    suit: 'spade',
  };

  return (
    <div className={classNames('flex justify-center items-center')}>
      <PlayingCardView card={card} />
    </div>
  );
}
