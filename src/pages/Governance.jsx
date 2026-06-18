import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getProposals, vote } from '../services/advancedService';
import Toast from '../components/Toast';
import { IconGovernance } from '../components/PremiumIcons';

const Governance = () => {
  const { user, showNotification } = useStore();
  const [proposals, setProposals] = useState([]);

  useEffect(() => { getProposals().then(setProposals); }, []);

  const handleVote = async (proposalId)
