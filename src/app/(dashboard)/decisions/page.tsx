"use client";
import React from 'react';
import { motion } from "framer-motion";
import DecisionTable from './components/decisionTable';

const DecisionsPage = () => {
  

  return (
    <motion.div 
      className="container mx-auto pt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <DecisionTable/>
    </motion.div>
  );
};

export default DecisionsPage;