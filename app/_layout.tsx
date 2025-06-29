import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, ImageBackground, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import QRCode from 'react-native-qrcode-svg';

interface PlayerColors {
  white: boolean;
  blue: boolean;
  black: boolean;
  red: boolean;
  green: boolean;
  colorless: boolean;
}

interface PlayerInfo {
  nickname: string;
  colors: PlayerColors;
}

interface PlayerStats {
  regularDamageDealt: { [key: number]: number };
  commanderDamageDealt: { [key: number]: number };
  regularDamageTaken: { [key: number]: number };
  commanderDamageTaken: { [key: number]: number };
  info: PlayerInfo;
  showCommander: boolean;
}

const MTG_COLORS = {
  white: '#F8F6D8',
  blue: '#0E68AB',
  black: '#150B00',
  red: '#D3202A',
  green: '#00733D',
  colorless: '#A4A4A4',
};

const landscapeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: '100%',
    width: '100%',
    gap: 0,
  },
  containerTwoPlayer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    height: '100%',
    width: '100%',
    gap: 0,
  },
  playerBox: {
    width: '50%',
    height: '50%',
    marginVertical: 0,
    marginHorizontal: 0,
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(13, 17, 38, 0.85)',
    borderRadius: 6,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerBoxWide: {
    width: '100%',
  },
  playerBoxTall: {
    height: '100%',
  },
  playerBoxTwoPlayer: {
    width: '100%',
    height: '50%',
    marginVertical: 0,
  },
  playerBoxReversed: {
    flexDirection: 'row-reverse',
  },
  playerBoxFlipped: {
    transform: [{ rotate: '180deg' }],
  },
  playerContent: {
    flex: 1,
  },
  lifeTotalContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 10,
  },
  lifeTotalContainerLeft: {
    left: -80,
  },
  lifeTotalContainerRight: {
    right: -80,
  },
  lifeTotal: {
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
  },
  healthControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginTop: 2,
    gap: 5,
  },
  healthButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  healthButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  healthValue: {
    color: '#fff',
    fontSize: 90,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 0,
    marginHorizontal: 5,
    marginTop: -12,
    marginBottom: -4,
  },
  lifeTotalsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  commanderLifeValue: {
    color: 'rgba(255, 0, 0, 0.8)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -8,
  },
  modeSwitch: {
    width: 35,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 2,
    marginTop: 0,
    alignSelf: 'center',
    marginRight: 8,
  },
  modeSwitchTrack: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  modeSwitchThumb: {
    width: 16,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 2,
  },
  damageSection: {
    marginTop: 8,
    width: '100%',
  },
  damageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 0,
    paddingHorizontal: 2,
  },
  damageButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  damageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    padding: 4,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  damageButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    opacity: 0.7,
  },
  damageAmount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 0,
    opacity: 0.7,
  },
  damageAdjustButton: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  damageAdjustButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    opacity: 0.7,
    lineHeight: 12,
  },
  statsContainer: {
    flex: 1,
  },
  statsContentContainer: {
    padding: 20,
    paddingBottom: 100, // Extra padding for the new game button
  },
  statsTitle: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  statsToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    gap: 15,
    paddingHorizontal: 20,
  },
  statsToggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  statsToggleActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  statsToggleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  chartContainer: {
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  playerTabsScroll: {
    maxHeight: 60,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  playerTab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playerTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  playerTabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  playerStatsScroll: {
    flex: 1,
  },
  playerStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playerStatsName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playerStatsColors: {
    flexDirection: 'row',
    gap: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  damageBreakdown: {
    marginTop: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  breakdownTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  breakdownText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  breakdownValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  newGameButtonContainer: {
    padding: 25,
    backgroundColor: 'rgba(33, 37, 58, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newGameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 140,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  qrCodeContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -125 }, { translateY: -125 }],
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 16,
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1a2a6c',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  diceInterfaceContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
  },
  diceInterfaceScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  diceInterfaceContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: '100%',
  },
  diceInterfaceTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  dicePickerContainer: {
    width: '100%',
    maxWidth: 200,
    height: 150,
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  dicePicker: {
    width: '100%',
    height: '100%',
  },
  dicePickerItem: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
  },
  diceResultContainer: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    width: '100%',
    maxWidth: 200,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  diceResultText: {
    fontSize: 72,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    maxWidth: 200,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  editPlayerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  editPlayerTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  nicknameInput: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  colorSelectorLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  colorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  colorButtonSelected: {
    borderColor: '#fff',
    borderWidth: 3,
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerColorIndicators: {
    flexDirection: 'row',
    marginLeft: 10,
    gap: 4,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  endGameButtonContainer: {
    width: '100%',
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  endGameButtonContainerLandscape: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -10 }],
    backgroundColor: 'transparent',
    zIndex: 1000,
    pointerEvents: 'box-none',
  },
  endGameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    margin: 0,
    width: 60,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'auto',
  },
  endGameButtonText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  portraitMessage: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: '20%',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  resultsContent: {
    marginBottom: 20,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
    width: '100%',
    gap: 12,
  },
  playerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    // flex: 1, // Remove this line for more precise alignment
  },
  playerNameFarLeft: {
    alignSelf: 'flex-start',
    marginLeft: 32, // More margin for edge
  },
  playerNameFarRight: {
    alignSelf: 'flex-end',
    marginRight: 32, // More margin for edge
  },
  playerTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeSwitch: {
    width: 35,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 2,
    marginTop: 0,
    alignSelf: 'center',
  },
  combinedModeButton: {
    width: 30,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 2,
    marginTop: 0,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  combinedModeButtonActive: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  combinedModeButtonText: {
    color: '#fff',
    fontSize: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  diceButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  diceButtonText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
  healthControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    marginTop: 2,
    gap: 5,
  },
  lifeTotalsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  commanderLifeValue: {
    color: 'rgba(255, 0, 0, 0.8)',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -8,
  },
  endGameFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  endGameFabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  endGameMenuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  endGameMenuButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  endGameButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  endGameButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Landscape-specific setup styles
  setupContentLandscape: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 5,
    paddingTop: 5,
    gap: 15,
  },
  setupTitleLandscape: {
    fontSize: 28,
    color: '#fff',
    marginTop: 0,
    fontWeight: 'bold',
  },
  setupLabelLandscape: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  pickerContainerLandscape: {
    width: '100%',
    maxWidth: 200,
    height: 80,
    backgroundColor: 'transparent',
  },
  startButtonsContainerLandscape: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 5,
  },
});

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(4);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'regular' | 'commander'>('regular');
  const [showQRCode, setShowQRCode] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [modeSliders, setModeSliders] = useState<boolean[]>(Array(4).fill(false));
  const [regularLifeTotals, setRegularLifeTotals] = useState<number[]>(Array(4).fill(40));
  const [commanderLifeTotals, setCommanderLifeTotals] = useState<number[]>(Array(4).fill(21));
  const [combinedMode, setCombinedMode] = useState<boolean[]>(Array(4).fill(false));
  const [activeDamageSource, setActiveDamageSource] = useState<number[]>(Array(4).fill(-1));

  const initializePlayerStats = (count: number) => {
    return Array(count).fill(null).map(() => ({
      regularDamageDealt: {},
      commanderDamageDealt: {},
      regularDamageTaken: {},
      commanderDamageTaken: {},
      info: {
        nickname: '',
        colors: {
          white: false,
          blue: false,
          black: false,
          red: false,
          green: false,
          colorless: false,
        },
      },
      showCommander: false,
    }));
  };

  const startGame = () => {
    setRegularLifeTotals(Array(playerCount).fill(40));
    setCommanderLifeTotals(Array(playerCount).fill(21));
    setPlayerStats(initializePlayerStats(playerCount));
    setGameStarted(true);
  };

  const endGame = () => {
    Alert.alert(
      "End Game",
      "Are you sure you want to end the current game?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "End Game",
          style: "destructive",
          onPress: () => setShowResults(true)
        }
      ]
    );
  };

  const updatePlayerInfo = (index: number, nickname: string, colors: PlayerColors) => {
    const updatedStats = [...playerStats];
    updatedStats[index].info = { nickname, colors };
    setPlayerStats(updatedStats);
    setEditingPlayer(null);
  };

  const renderColorSelector = (playerIndex: number, currentColors: PlayerColors) => {
    return (
      <View style={styles.colorSelector}>
        {Object.entries(MTG_COLORS).map(([color, hexCode]) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: hexCode },
              currentColors[color as keyof PlayerColors] && styles.colorButtonSelected
            ]}
            onPress={() => {
              const updatedStats = [...playerStats];
              updatedStats[playerIndex].info.colors = {
                ...updatedStats[playerIndex].info.colors,
                [color]: !currentColors[color as keyof PlayerColors],
              };
              setPlayerStats(updatedStats);
            }}
          />
        ))}
      </View>
    );
  };

  const renderPlayerColors = (colors: PlayerColors) => {
    return (
      <View style={styles.playerColorIndicators}>
        {Object.entries(colors).map(([color, isSelected]) => (
          isSelected && (
            <View
              key={color}
              style={[
                styles.colorIndicator,
                { backgroundColor: MTG_COLORS[color as keyof typeof MTG_COLORS] }
              ]}
            />
          )
        ))}
      </View>
    );
  };

  const adjustLife = (index: number, delta: number, isCommander = false) => {
    const duelMode = combinedMode[index];
    const updatedRegular = [...regularLifeTotals];
    const updatedCommander = [...commanderLifeTotals];
    let updateRegular = false;
    let updateCommander = false;

    if (duelMode) {
      updatedRegular[index] += delta;
      updatedCommander[index] += delta;
      updateRegular = true;
      updateCommander = true;
    } else if (isCommander) {
      updatedCommander[index] += delta;
      updateCommander = true;
    } else {
      updatedRegular[index] += delta;
      updateRegular = true;
    }

    if (updateRegular) setRegularLifeTotals(updatedRegular);
    if (updateCommander) setCommanderLifeTotals(updatedCommander);

    // If there's an active damage source, track the damage
    if (activeDamageSource[index] !== -1 && delta < 0) {
      const damageAmount = Math.abs(delta);
      const newPlayerStats = [...playerStats];
      const sourceIndex = activeDamageSource[index];
      if (duelMode) {
        // Track both regular and commander damage
        newPlayerStats[index].regularDamageTaken[sourceIndex] = 
          (newPlayerStats[index].regularDamageTaken[sourceIndex] || 0) + damageAmount;
        newPlayerStats[sourceIndex].regularDamageDealt[index] = 
          (newPlayerStats[sourceIndex].regularDamageDealt[index] || 0) + damageAmount;
        newPlayerStats[index].commanderDamageTaken[sourceIndex] = 
          (newPlayerStats[index].commanderDamageTaken[sourceIndex] || 0) + damageAmount;
        newPlayerStats[sourceIndex].commanderDamageDealt[index] = 
          (newPlayerStats[sourceIndex].commanderDamageDealt[index] || 0) + damageAmount;
      } else if (isCommander) {
        newPlayerStats[index].commanderDamageTaken[sourceIndex] = 
          (newPlayerStats[index].commanderDamageTaken[sourceIndex] || 0) + damageAmount;
        newPlayerStats[sourceIndex].commanderDamageDealt[index] = 
          (newPlayerStats[sourceIndex].commanderDamageDealt[index] || 0) + damageAmount;
      } else {
        newPlayerStats[index].regularDamageTaken[sourceIndex] = 
          (newPlayerStats[index].regularDamageTaken[sourceIndex] || 0) + damageAmount;
        newPlayerStats[sourceIndex].regularDamageDealt[index] = 
          (newPlayerStats[sourceIndex].regularDamageDealt[index] || 0) + damageAmount;
      }
      setPlayerStats(newPlayerStats);
    }
  };

  const adjustDamage = (currentPlayerIndex: number, sourceIndex: number, amount: number, isCommander: boolean) => {
    const updatedStats = [...playerStats];
    
    if (combinedMode[currentPlayerIndex]) {
      // In Duel mode, adjust both life totals and damage tracking
      const newRegularTotals = [...regularLifeTotals];
      const newCommanderTotals = [...commanderLifeTotals];
      
      // Update regular damage and life
      updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] = 
        Math.max(0, (updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] || 0) + amount);
      updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] = 
        Math.max(0, (updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] || 0) + amount);
      newRegularTotals[currentPlayerIndex] = Math.max(0, newRegularTotals[currentPlayerIndex] - amount);
      
      // Update commander damage and life
      updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] = 
        Math.max(0, (updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] || 0) + amount);
      updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] = 
        Math.max(0, (updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] || 0) + amount);
      newCommanderTotals[currentPlayerIndex] = Math.max(0, newCommanderTotals[currentPlayerIndex] - amount);
      
      setRegularLifeTotals(newRegularTotals);
      setCommanderLifeTotals(newCommanderTotals);
    } else {
      // Normal mode - only adjust the selected life total and damage tracking
      if (isCommander) {
        updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] = 
          Math.max(0, (updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] || 0) + amount);
        updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] = 
          Math.max(0, (updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] || 0) + amount);
        
        const newCommanderTotals = [...commanderLifeTotals];
        newCommanderTotals[currentPlayerIndex] = Math.max(0, newCommanderTotals[currentPlayerIndex] - amount);
        setCommanderLifeTotals(newCommanderTotals);
      } else {
        updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] = 
          Math.max(0, (updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] || 0) + amount);
        updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] = 
          Math.max(0, (updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] || 0) + amount);
        
        const newRegularTotals = [...regularLifeTotals];
        newRegularTotals[currentPlayerIndex] = Math.max(0, newRegularTotals[currentPlayerIndex] - amount);
        setRegularLifeTotals(newRegularTotals);
      }
    }
    
    setPlayerStats(updatedStats);
  };

  const handleDamageClick = (currentPlayerIndex: number, sourceIndex: number, isCommander: boolean) => {
    const damageAmount = 1;

    if (combinedMode[currentPlayerIndex]) {
      // In Duel mode, damage affects both life totals
      const newRegularTotals = [...regularLifeTotals];
      const newCommanderTotals = [...commanderLifeTotals];
      newRegularTotals[currentPlayerIndex] = Math.max(0, newRegularTotals[currentPlayerIndex] - damageAmount);
      newCommanderTotals[currentPlayerIndex] = Math.max(0, newCommanderTotals[currentPlayerIndex] - damageAmount);
      setRegularLifeTotals(newRegularTotals);
      setCommanderLifeTotals(newCommanderTotals);

      // Track damage in both regular and commander damage
      const updatedStats = [...playerStats];
      updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] = 
        (updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] || 0) + damageAmount;
      updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] = 
        (updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] || 0) + damageAmount;
      updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] = 
        (updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] || 0) + damageAmount;
      updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] = 
        (updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] || 0) + damageAmount;
      setPlayerStats(updatedStats);
    } else {
      // Normal mode - damage only affects the selected life total
      if (isCommander) {
        const newCommanderTotals = [...commanderLifeTotals];
        newCommanderTotals[currentPlayerIndex] = Math.max(0, newCommanderTotals[currentPlayerIndex] - damageAmount);
        setCommanderLifeTotals(newCommanderTotals);
      } else {
        const newRegularTotals = [...regularLifeTotals];
        newRegularTotals[currentPlayerIndex] = Math.max(0, newRegularTotals[currentPlayerIndex] - damageAmount);
        setRegularLifeTotals(newRegularTotals);
      }

      const updatedStats = [...playerStats];
      if (isCommander) {
        updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] = 
          (updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] || 0) + damageAmount;
        updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] = 
          (updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] || 0) + damageAmount;
      } else {
        updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] = 
          (updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] || 0) + damageAmount;
        updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] = 
          (updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] || 0) + damageAmount;
      }
      setPlayerStats(updatedStats);
    }
  };

  const getTotalDamage = (playerIndex: number, type: 'dealt' | 'taken', damageType: 'regular' | 'commander') => {
    const stats = playerStats[playerIndex];
    const damageMap = damageType === 'regular' 
      ? (type === 'dealt' ? stats.regularDamageDealt : stats.regularDamageTaken)
      : (type === 'dealt' ? stats.commanderDamageDealt : stats.commanderDamageTaken);
    
    return Object.values(damageMap).reduce((sum, damage) => sum + damage, 0);
  };

  const toggleDamageType = (playerIndex: number) => {
    const updatedStats = [...playerStats];
    updatedStats[playerIndex].showCommander = !updatedStats[playerIndex].showCommander;
    setPlayerStats(updatedStats);
  };

  const toggleCombinedMode = (index: number) => {
    const newCombinedMode = [...combinedMode];
    newCombinedMode[index] = !newCombinedMode[index];
    setCombinedMode(newCombinedMode);
  };

  const generateGameResults = () => {
    return JSON.stringify({
      players: playerStats.map((player, index) => ({
        nickname: player.info.nickname || `Player ${index + 1}`,
        colors: player.info.colors,
        finalRegularLife: regularLifeTotals[index],
        finalCommanderLife: commanderLifeTotals[index],
        regularDamageDealt: player.regularDamageDealt,
        commanderDamageDealt: player.commanderDamageDealt,
        regularDamageTaken: player.regularDamageTaken,
        commanderDamageTaken: player.commanderDamageTaken,
      })),
      timestamp: new Date().toISOString(),
    });
  };

  const shareGameResults = async () => {
    const results = generateGameResults();
    const gameData = JSON.parse(results);
    
    const message = `🎮 Magic: The Gathering Game Results 🎮\n\n` +
      gameData.players.map((player: any, index: number) => {
        const colors = Object.entries(player.colors)
          .filter(([_, selected]) => selected)
          .map(([color]) => color.charAt(0).toUpperCase() + color.slice(1))
          .join(', ');
        
        const totalRegularDamageDealt = Object.values(player.regularDamageDealt as Record<string, number>)
          .reduce((sum, damage) => sum + damage, 0);
        const totalRegularDamageTaken = Object.values(player.regularDamageTaken as Record<string, number>)
          .reduce((sum, damage) => sum + damage, 0);
        const totalCommanderDamageDealt = Object.values(player.commanderDamageDealt as Record<string, number>)
          .reduce((sum, damage) => sum + damage, 0);
        const totalCommanderDamageTaken = Object.values(player.commanderDamageTaken as Record<string, number>)
          .reduce((sum, damage) => sum + damage, 0);
        
        return `Player ${index + 1}${player.nickname ? ` (${player.nickname})` : ''}:\n` +
          `Colors: ${colors}\n` +
          `Final Regular Life: ${player.finalRegularLife}\n` +
          `Final Commander Life: ${player.finalCommanderLife}\n` +
          `Total Regular Damage Dealt: ${totalRegularDamageDealt}\n` +
          `Total Regular Damage Taken: ${totalRegularDamageTaken}\n` +
          `Total Commander Damage Dealt: ${totalCommanderDamageDealt}\n` +
          `Total Commander Damage Taken: ${totalCommanderDamageTaken}\n` +
          `\nRegular Damage Breakdown:\n` +
          Object.entries(player.regularDamageDealt).map(([targetIndex, damage]) => 
            `  To ${gameData.players[parseInt(targetIndex)].nickname || `Player ${parseInt(targetIndex) + 1}`}: ${damage}`
          ).join('\n') +
          `\nCommander Damage Breakdown:\n` +
          Object.entries(player.commanderDamageDealt).map(([targetIndex, damage]) => 
            `  To ${gameData.players[parseInt(targetIndex)].nickname || `Player ${parseInt(targetIndex) + 1}`}: ${damage}`
          ).join('\n');
      }).join('\n\n') +
      `\n\nGame ended at: ${new Date(gameData.timestamp).toLocaleString()}`;

    try {
      await Share.share({
        message,
        title: 'Magic: The Gathering Game Results',
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  const toggleMode = (index: number) => {
    const newModes = [...modeSliders];
    newModes[index] = !newModes[index];
    setModeSliders(newModes);
  };

  const adjustHealth = (index: number, amount: number, isCommander: boolean) => {
    if (combinedMode[index]) {
      const newRegularTotals = [...regularLifeTotals];
      const newCommanderTotals = [...commanderLifeTotals];
      newRegularTotals[index] = Math.max(0, newRegularTotals[index] + amount);
      newCommanderTotals[index] = Math.max(0, newCommanderTotals[index] + amount);
      setRegularLifeTotals(newRegularTotals);
      setCommanderLifeTotals(newCommanderTotals);
    } else {
      if (isCommander) {
        const newTotals = [...commanderLifeTotals];
        newTotals[index] = Math.max(0, newTotals[index] + amount);
        setCommanderLifeTotals(newTotals);
      } else {
        const newTotals = [...regularLifeTotals];
        newTotals[index] = Math.max(0, newTotals[index] + amount);
        setRegularLifeTotals(newTotals);
      }
    }
  };

  const handleDamageSourceToggle = (index: number, sourceIndex: number) => {
    const newActiveDamageSource = [...activeDamageSource];
    newActiveSource[index] = newActiveSource[index] === sourceIndex ? -1 : sourceIndex;
    setActiveDamageSource(newActiveSource);
  };

  if (editingPlayer !== null) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/images/background_img.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(23, 27, 48, 0.95)', 'rgba(33, 37, 58, 0.9)', 'rgba(43, 47, 68, 0.85)']}
            style={styles.gradient}
          >
            <View style={styles.editPlayerContainer}>
              <Text style={styles.editPlayerTitle}>Edit Player {editingPlayer + 1}</Text>
              <TextInput
                style={styles.nicknameInput}
                placeholder="Enter nickname"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={playerStats[editingPlayer].info.nickname}
                onChangeText={(text) => {
                  const updatedStats = [...playerStats];
                  updatedStats[editingPlayer].info.nickname = text;
                  setPlayerStats(updatedStats);
                }}
              />
              <Text style={styles.colorSelectorLabel}>Select Colors:</Text>
              {renderColorSelector(editingPlayer, playerStats[editingPlayer].info.colors)}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => setEditingPlayer(null)}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

  if (!gameStarted) {
    return (
      <View style={styles.setupContainer}>
        <ImageBackground
          source={require('../assets/images/background_img.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(23, 27, 48, 0.95)', 'rgba(33, 37, 58, 0.9)', 'rgba(43, 47, 68, 0.85)']}
            style={styles.gradient}
          >
            <View style={[
              styles.setupContent,
              isLandscape && landscapeStyles.setupContentLandscape
            ]}>
              <Text style={[
                styles.setupTitle,
                isLandscape && landscapeStyles.setupTitleLandscape
              ]}>Tragic the Mattering</Text>
              
              <Text style={[
                styles.setupLabel,
                isLandscape && landscapeStyles.setupLabelLandscape
              ]}>Number of Athletes:</Text>
              
              <View style={[
                styles.pickerContainer,
                isLandscape && landscapeStyles.pickerContainerLandscape
              ]}>
                <Picker
                  selectedValue={playerCount}
                  onValueChange={(value) => setPlayerCount(value)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <Picker.Item
                      key={num}
                      label={num.toString()}
                      value={num}
                      color="#fff"
                    />
                  ))}
                </Picker>
              </View>
              
              <View style={[
                styles.startButtonsContainer,
                isLandscape && landscapeStyles.startButtonsContainerLandscape
              ]}>
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                  <Text style={styles.startButtonText}>Start Game</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

  if (showResults) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(33, 37, 58, 0.95)', 'rgba(43, 47, 68, 0.9)', 'rgba(53, 57, 78, 0.85)']}
          style={styles.gradient}
        >
          <ScrollView 
            style={styles.statsContainer} 
            contentContainerStyle={styles.statsContentContainer}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.statsTitle}>Game Summary</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setQrCodeVisible(true)}
              >
                <Text style={styles.actionButtonText}>Generate QR Code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={shareGameResults}
              >
                <Text style={styles.actionButtonText}>Share Results</Text>
              </TouchableOpacity>
            </View>

            {qrCodeVisible && (
              <View style={styles.qrCodeContainer}>
                <QRCode
                  value={generateGameResults()}
                  size={200}
                  backgroundColor="white"
                  color="black"
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setQrCodeVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.statsToggleContainer}>
              <TouchableOpacity
                style={[styles.statsToggleButton, selectedTab === 'regular' && styles.statsToggleActive]}
                onPress={() => setSelectedTab('regular')}
              >
                <Text style={styles.statsToggleText}>Main Life</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.statsToggleButton, selectedTab === 'commander' && styles.statsToggleActive]}
                onPress={() => setSelectedTab('commander')}
              >
                <Text style={styles.statsToggleText}>Commander</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Total Damage Dealt</Text>
              <PieChart
                data={playerStats.map((player, index) => ({
                  name: player.info.nickname || `Player ${index + 1}`,
                  population: getTotalDamage(index, 'dealt', selectedTab),
                  color: `hsl(${(index * 360) / playerStats.length}, 70%, 50%)`,
                  legendFontColor: "#fff",
                  legendFontSize: 12
                })).filter(d => d.population > 0)}
                width={width - 40}
                height={200}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  backgroundGradientFrom: "transparent",
                  backgroundGradientTo: "transparent",
                  decimalPlaces: 0,
                  propsForLabels: {
                    fill: "#fff"
                  }
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            <ScrollView 
              horizontal 
              style={styles.playerTabsScroll}
              showsHorizontalScrollIndicator={false}
            >
              {playerStats.map((player, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.playerTab,
                    selectedPlayer === index && styles.playerTabActive
                  ]}
                  onPress={() => setSelectedPlayer(index)}
                >
                  <Text style={styles.playerTabText}>
                    {player.info.nickname || `Player ${index + 1}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.resultsContent}>
              {selectedPlayer !== null && (
                <View style={styles.playerStatsScroll}>
                  <View style={styles.playerStatsHeader}>
                    <Text style={styles.playerStatsName}>
                      {playerStats[selectedPlayer].info.nickname || `Player ${selectedPlayer + 1}`}
                    </Text>
                    <View style={styles.playerStatsColors}>
                      {renderPlayerColors(playerStats[selectedPlayer].info.colors)}
                    </View>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Regular Damage Dealt:</Text>
                    <Text style={styles.statValue}>
                      {getTotalDamage(selectedPlayer, 'dealt', 'regular')}
                    </Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Regular Damage Taken:</Text>
                    <Text style={styles.statValue}>
                      {getTotalDamage(selectedPlayer, 'taken', 'regular')}
                    </Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Commander Damage Dealt:</Text>
                    <Text style={styles.statValue}>
                      {getTotalDamage(selectedPlayer, 'dealt', 'commander')}
                    </Text>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Commander Damage Taken:</Text>
                    <Text style={styles.statValue}>
                      {getTotalDamage(selectedPlayer, 'taken', 'commander')}
                    </Text>
                  </View>

                  <View style={styles.damageBreakdown}>
                    <Text style={styles.breakdownTitle}>Regular Damage Dealt To:</Text>
                    {Object.entries(playerStats[selectedPlayer].regularDamageDealt).map(([targetIndex, damage]) => (
                      <View key={targetIndex} style={styles.breakdownRow}>
                        <Text style={styles.breakdownText}>
                          {playerStats[parseInt(targetIndex)].info.nickname || `Player ${parseInt(targetIndex) + 1}`}:
                        </Text>
                        <Text style={styles.breakdownValue}>{damage}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.damageBreakdown}>
                    <Text style={styles.breakdownTitle}>Commander Damage Dealt To:</Text>
                    {Object.entries(playerStats[selectedPlayer].commanderDamageDealt).map(([targetIndex, damage]) => (
                      <View key={targetIndex} style={styles.breakdownRow}>
                        <Text style={styles.breakdownText}>
                          {playerStats[parseInt(targetIndex)].info.nickname || `Player ${parseInt(targetIndex) + 1}`}:
                        </Text>
                        <Text style={styles.breakdownValue}>{damage}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.newGameButtonContainer}>
              <TouchableOpacity
                style={styles.newGameButton}
                onPress={() => {
                  setShowResults(false);
                  setGameStarted(false);
                  setSelectedPlayer(null);
                }}
              >
                <Text style={styles.newGameButtonText}>New Game</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    );
  }

  if (!isLandscape) {
    return (
      <View style={styles.setupContainer}>
        <ImageBackground
          source={require('../assets/images/background_img.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(23, 27, 48, 0.95)', 'rgba(33, 37, 58, 0.9)', 'rgba(43, 47, 68, 0.85)']}
            style={styles.gradient}
          >
            <View style={styles.setupContent}>
              <Text style={styles.portraitMessage}>Please rotate your device to landscape mode to play</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(33, 37, 58, 0.95)', 'rgba(43, 47, 68, 0.9)', 'rgba(53, 57, 78, 0.85)']}
        style={styles.gradient}
      >
        <View style={[
          styles.playersContainer, 
          playerCount === 2 ? landscapeStyles.containerTwoPlayer : landscapeStyles.container
        ]}>
          {Array(playerCount).fill(null).map((_, index) => {
            const isWideBox = playerCount === 3 && index === 2;
            const isTallBox = playerCount <= 2;
            const isTwoPlayerBox = playerCount === 2;

            return (
              <View 
                key={index} 
                style={[
                  styles.playerBox,
                  landscapeStyles.playerBox,
                  isWideBox && landscapeStyles.playerBoxWide,
                  isTallBox && landscapeStyles.playerBoxTall,
                  isTwoPlayerBox && landscapeStyles.playerBoxTwoPlayer,
                  // 2-player layout: Player 1 mirrors Player 2 (no flip), Player 2 normal
                  (playerCount === 2 && index === 0) && landscapeStyles.playerBoxFlipped,
                  // 3-player layout: Players 1 and 2 flipped
                  (playerCount === 3 && (index === 0 || index === 1)) && landscapeStyles.playerBoxFlipped,
                  // 4-player layout: Players 2 and 4 reversed, Players 1 and 2 flipped
                  (playerCount === 4 && (index === 1 || index === 3)) && landscapeStyles.playerBoxReversed,
                  (playerCount === 4 && (index === 0 || index === 1)) && landscapeStyles.playerBoxFlipped,
                  modeSliders[index] && { backgroundColor: 'rgba(255, 0, 0, 0.2)' }
                ]}
              >
                <View style={[styles.playerContent, landscapeStyles.playerContent]}>
                  <View style={landscapeStyles.playerHeader}>
                    {index === 0 ? (
                      <>
                        <View style={landscapeStyles.headerControls}>
                          <TouchableOpacity
                            style={landscapeStyles.modeSwitch}
                            onPress={() => toggleMode(index)}
                          >
                            <View style={landscapeStyles.modeSwitchTrack}>
                              <View style={[
                                landscapeStyles.modeSwitchThumb,
                                { marginLeft: modeSliders[index] ? 'auto' : 0 }
                              ]} />
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              landscapeStyles.combinedModeButton,
                              combinedMode[index] && landscapeStyles.combinedModeButtonActive
                            ]}
                            onPress={() => toggleCombinedMode(index)}
                          >
                            <Text style={landscapeStyles.combinedModeButtonText}>Duel</Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          style={[
                            landscapeStyles.playerNameContainer,
                            landscapeStyles.playerNameFarLeft
                          ]}
                          onPress={() => setEditingPlayer(index)}
                        >
                          <Text style={landscapeStyles.playerTitle}>
                            {playerStats[index].info.nickname || `Player ${index + 1}`}
                          </Text>
                          {renderPlayerColors(playerStats[index].info.colors)}
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={[
                            landscapeStyles.playerNameContainer,
                            index === 0 && landscapeStyles.playerNameFarLeft,
                            index === 1 && landscapeStyles.playerNameFarRight,
                          ]}
                          onPress={() => setEditingPlayer(index)}
                        >
                          <Text style={landscapeStyles.playerTitle}>
                            {playerStats[index].info.nickname || `Player ${index + 1}`}
                          </Text>
                          {renderPlayerColors(playerStats[index].info.colors)}
                        </TouchableOpacity>
                        <View style={landscapeStyles.headerControls}>
                          <TouchableOpacity
                            style={landscapeStyles.modeSwitch}
                            onPress={() => toggleMode(index)}
                          >
                            <View style={landscapeStyles.modeSwitchTrack}>
                              <View style={[
                                landscapeStyles.modeSwitchThumb,
                                { marginLeft: modeSliders[index] ? 'auto' : 0 }
                              ]} />
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              landscapeStyles.combinedModeButton,
                              combinedMode[index] && landscapeStyles.combinedModeButtonActive
                            ]}
                            onPress={() => toggleCombinedMode(index)}
                          >
                            <Text style={landscapeStyles.combinedModeButtonText}>Duel</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>

                  <View style={landscapeStyles.healthControls}>
                    <TouchableOpacity
                      style={landscapeStyles.healthButton}
                      onPress={() => adjustLife(index, -1, modeSliders[index])}
                    >
                      <Text style={landscapeStyles.healthButtonText}>-</Text>
                    </TouchableOpacity>
                    <View style={landscapeStyles.lifeTotalsContainer}>
                      <Text style={[
                        landscapeStyles.healthValue,
                        !modeSliders[index] && { color: '#fff' },
                        modeSliders[index] && { color: 'rgba(255, 255, 255, 0.5)' }
                      ]}>
                        {regularLifeTotals[index]}
                      </Text>
                      <Text style={[
                        landscapeStyles.commanderLifeValue,
                        modeSliders[index] && { color: 'rgba(255, 0, 0, 0.8)' },
                        !modeSliders[index] && { color: 'rgba(255, 0, 0, 0.5)' }
                      ]}>
                        {commanderLifeTotals[index]}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={landscapeStyles.healthButton}
                      onPress={() => adjustLife(index, 1, modeSliders[index])}
                    >
                      <Text style={landscapeStyles.healthButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={landscapeStyles.damageSection}>
                    <View style={landscapeStyles.damageButtonsContainer}>
                      {Array(playerCount).fill(null).map((_, sourceIndex) => (
                        sourceIndex !== index && (
                          <TouchableOpacity
                            key={sourceIndex}
                            style={[
                              landscapeStyles.damageButton,
                              activeDamageSource[index] === sourceIndex && { backgroundColor: 'rgba(255, 0, 0, 0.3)' }
                            ]}
                            onPress={() => handleDamageSourceToggle(index, sourceIndex)}
                          >
                            <Text style={landscapeStyles.damageButtonText}>
                              {playerStats[sourceIndex].info.nickname || `P${sourceIndex + 1}`}
                            </Text>
                            <Text style={[
                              landscapeStyles.damageAmount,
                              { color: modeSliders[index] ? 'rgba(255, 0, 0, 0.8)' : '#fff' }
                            ]}>
                              {modeSliders[index] 
                                ? playerStats[index]?.commanderDamageTaken[sourceIndex] || 0
                                : playerStats[index]?.regularDamageTaken[sourceIndex] || 0}
                            </Text>
                          </TouchableOpacity>
                        )
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <TouchableOpacity
          style={styles.endGameButton}
          onPress={endGame}
        >
          <Text style={styles.endGameButtonText}>End</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  gradient: {
    flex: 1,
  },
  setupContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  setupContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  setupTitle: {
    fontSize: 36,
    color: '#fff',
    marginTop: '20%',
    fontWeight: 'bold',
  },
  setupLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 200,
    height: 150,
    backgroundColor: 'transparent',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  pickerItem: {
    color: '#fff',
    fontSize: 72,
  },
  startButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
  },
  startButton: {
    width: '80%',
    maxWidth: 300,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playersContainer: {
    padding: 0,
    width: '100%',
    height: '100%',
  },
  playerBox: {
    width: '49.5%',
    height: '49%',
    marginVertical: 1,
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(13, 17, 38, 0.85)',
    borderRadius: 6,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerContent: {
    flex: 1,
    flexDirection: 'column',
  },
  portraitMessage: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: '20%',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  endGameButton: {
    position: 'absolute',
    top: '50%',
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    transform: [{ translateY: -15 }],
  },
  endGameButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  colorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  colorButtonSelected: {
    borderColor: '#fff',
    borderWidth: 3,
  },
  playerColorIndicators: {
    flexDirection: 'row',
    marginLeft: 10,
    gap: 4,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editPlayerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  editPlayerTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  nicknameInput: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  colorSelectorLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
  
  