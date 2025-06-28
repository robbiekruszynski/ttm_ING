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
    justifyContent: 'space-around',
    paddingHorizontal: 1,
    paddingTop: 1,
    height: '100%',
    width: '100%',
  },
  containerTwoPlayer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingHorizontal: 1,
    paddingTop: 1,
    height: '100%',
    width: '100%',
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
  playerBoxWide: {
    width: '99%',
  },
  playerBoxTall: {
    height: '98%',
  },
  playerBoxTwoPlayer: {
    width: '99%',
    height: '48%',
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
    marginTop: -4,
    width: '100%',
  },
  damageSectionTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.7,
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
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  statsToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  statsToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsToggleActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#fff',
  },
  statsToggleText: {
    color: '#fff',
    fontSize: 16,
  },
  chartContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  playerTabsScroll: {
    maxHeight: 50,
    marginBottom: 20,
  },
  playerTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#fff',
  },
  playerTabText: {
    color: '#fff',
    fontSize: 16,
  },
  playerStatsScroll: {
    flex: 1,
  },
  playerStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  playerStatsName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  playerStatsColors: {
    flexDirection: 'row',
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  statLabel: {
    color: '#fff',
    fontSize: 16,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  damageBreakdown: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  breakdownTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownText: {
    color: '#fff',
    fontSize: 16,
  },
  breakdownValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newGameButtonContainer: {
    padding: 20,
    backgroundColor: 'rgba(33, 37, 58, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  newGameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  qrCodeContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#1a2a6c',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
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
});

export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [gameStarted, setGameStarted] = useState(false);
  const [playerCount, setPlayerCount] = useState(4);
  const [lifeTotals, setLifeTotals] = useState<number[]>([]);
  const [commanderTotals, setCommanderTotals] = useState<number[]>([]);
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
    const updated = isCommander ? [...commanderTotals] : [...lifeTotals];
    updated[index] += delta;
    isCommander ? setCommanderTotals(updated) : setLifeTotals(updated);
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
            <View style={styles.setupContent}>
              <Text style={styles.setupTitle}>Tragic the Mattering</Text>
              <View style={styles.setupForm}>
                <Text style={styles.setupLabel}>Number of Athletes:</Text>
                <View style={styles.pickerContainer}>
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
              </View>
              <View style={styles.startButtonsContainer}>
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
        <TouchableOpacity
          style={styles.endGameFab}
          onPress={endGame}
        >
          <Text style={styles.endGameFabText}>End</Text>
        </TouchableOpacity>
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
                      onPress={() => adjustHealth(index, -1, modeSliders[index])}
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
                      onPress={() => adjustHealth(index, 1, modeSliders[index])}
                    >
                      <Text style={landscapeStyles.healthButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={landscapeStyles.damageSection}>
                    <Text style={landscapeStyles.damageSectionTitle}>Damage From:</Text>
                    <View style={landscapeStyles.damageButtonsContainer}>
                      {Array(playerCount).fill(null).map((_, sourceIndex) => (
                        sourceIndex !== index && (
                          <View key={sourceIndex} style={landscapeStyles.damageButtonWrapper}>
                            <TouchableOpacity
                              style={landscapeStyles.damageAdjustButton}
                              onPress={() => adjustDamage(index, sourceIndex, -1, modeSliders[index])}
                            >
                              <Text style={landscapeStyles.damageAdjustButtonText}>-</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={landscapeStyles.damageButton}
                              onPress={() => handleDamageClick(index, sourceIndex, modeSliders[index])}
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
                            <TouchableOpacity
                              style={landscapeStyles.damageAdjustButton}
                              onPress={() => adjustDamage(index, sourceIndex, 1, modeSliders[index])}
                            >
                              <Text style={landscapeStyles.damageAdjustButtonText}>+</Text>
                            </TouchableOpacity>
                          </View>
                        )
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
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
  setupForm: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: 10,
    width: '100%',
  },
  playersContainerLandscape: {
    paddingHorizontal: 5,
  },
  playersGrid: {
    flexDirection: 'column',
  },
  playersGridLandscape: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
  playerBoxLandscape: {
    width: '48%',
    marginHorizontal: '1%',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 4,
    width: '100%',
  },
  playerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  playerTitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
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
    marginRight: 8,
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
    marginRight: 8,
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
  damageSection: {
    marginTop: 0,
    width: '100%',
  },
  damageSectionTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
    opacity: 0.7,
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
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  statsToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  statsToggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statsToggleActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#fff',
  },
  statsToggleText: {
    color: '#fff',
    fontSize: 16,
  },
  chartContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  chartTitle: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  playerTabsScroll: {
    maxHeight: 50,
    marginBottom: 20,
  },
  playerTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#fff',
  },
  playerTabText: {
    color: '#fff',
    fontSize: 16,
  },
  playerStatsScroll: {
    flex: 1,
  },
  playerStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  playerStatsName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  playerStatsColors: {
    flexDirection: 'row',
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  statLabel: {
    color: '#fff',
    fontSize: 16,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  damageBreakdown: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  breakdownTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownText: {
    color: '#fff',
    fontSize: 16,
  },
  breakdownValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newGameButtonContainer: {
    padding: 20,
    backgroundColor: 'rgba(33, 37, 58, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  newGameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  newGameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 15,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  qrCodeContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#1a2a6c',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
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
  lifeTotalsContainer: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    zIndex: 10,
  },
  commanderLifeValue: {
    fontSize: 48,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
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
});




  
  