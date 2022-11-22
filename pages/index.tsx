import classNames from 'classnames';
import PlayingCard from '../components/PlayingCard';
import { Card } from '../types/Card';
import { CardFace } from '../types/CardFace';
import { Rank } from '../types/Rank';
import { Suit } from '../types/Suit';

export default function Home() {
  const card = new Card(Rank.Ace, Suit.Spade, CardFace.Up);

  return (
    <div className={classNames('flex justify-center items-center')}>
      <PlayingCard card={card} />
    </div>
  );
}
