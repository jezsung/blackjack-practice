import classNames from 'classnames';
import PlayingCardView from '../components/PlayingCardView';
import { useAppDispatch } from '../hooks/use-app-dispatch';
import { useAppSelector } from '../hooks/use-app-selector';
import { bet, start } from '../store/slices/blackjack';

export default function Home() {
  const dispatch = useAppDispatch();

  const dealerCards = useAppSelector((state) => state.blackjack.dealerHand.cards);
  const playerHands = useAppSelector((state) => state.blackjack.playerHands);
  const balance = useAppSelector((state) => state.blackjack.balance);
  const betAmount = useAppSelector((state) => state.blackjack.betAmount);

  return (
    <div className={classNames('relative h-screen')}>
      <div className={classNames('absolute top-8 left-1/2 -translate-x-1/2 flex gap-1')}>
        {dealerCards.map((card) => (
          <PlayingCardView key={`${card.rank}${card.suit}`} card={card} />
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8">
        <div className="flex gap-1">
          {playerHands.map((hand, i) => (
            <div key={i} className={classNames('flex gap-1')}>
              {hand.cards.map((card) => (
                <PlayingCardView key={`${card.rank}${card.suit}`} card={card} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center rounded-full border border-white w-9 h-9 text-white text-center">
          {betAmount > 0 ? `\$${betAmount}` : null}
        </div>
        <div className="flex gap-4">
          <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white">Hit</button>
          <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white">Stand</button>
          <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white">Double Down</button>
          <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white">Split</button>
        </div>
        <div className="text-white text-xl">${balance}</div>
        <div className="flex gap-4">
          <button
            className="bg-white rounded-full border-2 border-black border-dashed w-12 h-12 text-black"
            onClick={() => dispatch(bet(5))}
          >
            $5
          </button>
          <button
            className="bg-red-700 rounded-full border-2 border-gray-200 border-dashed w-12 h-12 text-gray-200"
            onClick={() => dispatch(bet(10))}
          >
            $10
          </button>
          <button
            className="bg-green-600 rounded-full border-2 border-gray-200 border-dashed w-12 h-12 text-gray-200"
            onClick={() => dispatch(bet(20))}
          >
            $20
          </button>
          <button
            className="bg-blue-600 rounded-full border-2 border-gray-200 border-dashed w-12 h-12 text-gray-200"
            onClick={() => dispatch(bet(50))}
          >
            $50
          </button>
          <button
            className="bg-black rounded-full border-2 border-gray-200 border-dashed w-12 h-12 text-gray-200"
            onClick={() => dispatch(bet(100))}
          >
            $100
          </button>
          <button className="bg-[#005bdc] min-w-[88px] w-36 h-12 rounded text-white" onClick={() => dispatch(start())}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
