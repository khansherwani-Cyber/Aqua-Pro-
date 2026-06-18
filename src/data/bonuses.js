export const bonusDefinitions = [
  {
    id: 'first-wave',
    name: 'First Wave',
    icon: '🎁',
    description: 'Deposit $50+ and get a free 15-day Coastal Turbine',
    value: 80,
    condition: (user, totalDeposits) => totalDeposits >= 50,
  },
  {
    id: 'power-surge',
    name: 'Power Surge',
    icon: '⚡',
    description: 'Reinvest any harvest for an extra 2% bonus',
    value: 0.02,
    condition: (user, harvests) => harvests >= 1,
  },
  {
    id: 'deep-dive',
    name: 'Deep Dive Pack',
    icon: '🤿',
    description: 'Deposit $200+ total and get 5% back instantly',
    value: 10,
    condition: (user, totalDeposits) => totalDeposits >= 200,
  },
];
