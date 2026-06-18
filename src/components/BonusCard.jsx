const BonusCard = ({ bonus, claimed, onClaim }) => (
  <div className={`glass-sm flex items-center justify-between ${claimed ? 'opacity-50' : ''}`}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{bonus.icon}</span>
      <div>
        <p className="font-semibold text-pearl">{bonus.name}</p>
        <p className="text-xs text-pearl/40">{bonus.description}</p>
      </div>
    </div>
    {claimed ? (
      <span className="text-xs text-green-400 font-semibold">✓ Claimed</span>
    ) : (
      <button onClick={onClaim} className="bg-platinum text-sapphire font-bold px-4 py-1 rounded-full text-xs hover:bg-rosegold transition">
        Claim ${bonus.value || bonus.reward?.amount || 0}
      </button>
    )}
  </div>
);
export default BonusCard;
