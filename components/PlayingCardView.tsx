import classNames from 'classnames';
import { PlayingCard } from '../types/playing-card';

interface Props {
  className?: string | undefined;
  card: PlayingCard;
}

function PlayingCardView({ className, card: { rank, suit, face } }: Props) {
  if (face === 'down') {
    return <div className={classNames('w-[50px] h-[70px]', 'bg-sky-400 rounded-sm border-white border')} />;
  }

  let rankDisplay: string;
  let suitDisplay: string;

  switch (rank) {
    case '2':
      rankDisplay = '2';
      break;
    case '3':
      rankDisplay = '3';
      break;
    case '4':
      rankDisplay = '4';
      break;
    case '5':
      rankDisplay = '5';
      break;
    case '6':
      rankDisplay = '6';
      break;
    case '7':
      rankDisplay = '7';
      break;
    case '8':
      rankDisplay = '8';
      break;
    case '9':
      rankDisplay = '9';
      break;
    case '10':
      rankDisplay = '10';
      break;
    case 'jack':
      rankDisplay = 'J';
      break;
    case 'queen':
      rankDisplay = 'Q';
      break;
    case 'king':
      rankDisplay = 'K';
      break;
    case 'ace':
      rankDisplay = 'A';
      break;
  }

  switch (suit) {
    case 'club':
      suitDisplay = '♣';
      break;
    case 'diamond':
      suitDisplay = '♦';
      break;
    case 'heart':
      suitDisplay = '♥';
      break;
    case 'spade':
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
          'text-black': suit === 'club' || suit === 'spade',
          'text-red-500': suit === 'diamond' || suit === 'heart',
        })}
      >
        {suitDisplay}
      </div>
      <div className={classNames('text-lg')}>{rankDisplay}</div>
    </div>
  );
}

export default PlayingCardView;
