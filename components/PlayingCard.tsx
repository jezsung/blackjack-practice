import classNames from 'classnames';
import { Rank } from '../types/Rank';
import { Suit } from '../types/Suit';

interface Props {
  className?: string | undefined;
  rank: Rank;
  suit: Suit;
}

function PlayingCard({ className, rank, suit }: Props) {
  let rankDisplay: string;
  let suitDisplay: string;

  switch (rank) {
    case Rank.One:
      rankDisplay = '1';
      break;
    case Rank.Two:
      rankDisplay = '2';
      break;
    case Rank.Three:
      rankDisplay = '3';
      break;
    case Rank.Four:
      rankDisplay = '4';
      break;
    case Rank.Five:
      rankDisplay = '5';
      break;
    case Rank.Six:
      rankDisplay = '6';
      break;
    case Rank.Seven:
      rankDisplay = '7';
      break;
    case Rank.Eight:
      rankDisplay = '8';
      break;
    case Rank.Nine:
      rankDisplay = '9';
      break;
    case Rank.Ten:
      rankDisplay = '10';
      break;
    case Rank.Jack:
      rankDisplay = 'J';
      break;
    case Rank.Queen:
      rankDisplay = 'Q';
      break;
    case Rank.King:
      rankDisplay = 'K';
      break;
    case Rank.Ace:
      rankDisplay = 'A';
      break;
  }

  switch (suit) {
    case Suit.Club:
      suitDisplay = '♣';
      break;
    case Suit.Diamond:
      suitDisplay = '♦';
      break;
    case Suit.Heart:
      suitDisplay = '♥';
      break;
    case Suit.Spade:
      suitDisplay = '♠';
      break;
  }

  return (
    <div
      className={classNames(
        className,
        'flex flex-col justify-center items-center',
        'w-[50px] h-[70px]',
        'bg-white rounded-sm'
      )}
    >
      <div
        className={classNames('text-lg', {
          'text-black': suit === Suit.Club || suit === Suit.Spade,
          'text-red-500': suit === Suit.Diamond || suit === Suit.Heart,
        })}
      >
        {suitDisplay}
      </div>
      <div className={classNames('text-lg')}>{rankDisplay}</div>
    </div>
  );
}

export default PlayingCard;
