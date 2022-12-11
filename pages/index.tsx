import classNames from 'classnames';
import { useEffect } from 'react';
import PlayingCardView from '../components/PlayingCardView';
import { useAppDispatch } from '../hooks/use-app-dispatch';
import { useAppSelector } from '../hooks/use-app-selector';
import { start } from '../store/slices/blackjack';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(start());
  }, []);

  const dealerCards = useAppSelector((state) => state.blackjack.dealerHand.cards);
  const playerHands = useAppSelector((state) => state.blackjack.playerHands);

  return (
    <div className={classNames('relative h-screen')}>
      <div className={classNames('absolute top-8 left-1/2 -translate-x-1/2 flex gap-1')}>
        {dealerCards.map((card) => (
          <PlayingCardView key={`${card.rank}${card.suit}`} card={card} />
        ))}
      </div>
      <div className={classNames('absolute bottom-48 left-1/2 -translate-x-1/2 flex')}>
        {playerHands.map((hand, i) => (
          <div key={i} className={classNames('flex gap-1')}>
            {hand.cards.map((card) => (
              <PlayingCardView key={`${card.rank}${card.suit}`} card={card} />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white">Hit</button>
        <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white">Stand</button>
        <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white">Double Down</button>
        <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white">Split</button>
      </div>
    </div>
  );
}
