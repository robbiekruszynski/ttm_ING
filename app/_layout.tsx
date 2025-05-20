import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Animated, ImageBackground, Modal, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
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
  playerBox: {
    width: '49.5%',
    height: '49%',
    marginVertical: 1,
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerBoxReversed: {
    flexDirection: 'row-reverse',
  },
  playerBoxFlipped: {
    transform: [{ rotate: '180deg' }],
  },
  playerContent: {
    flex: 1,
    height: '100%',
    padding: 10,
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
  modeSwitch: {
    width: 35,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 2,
    marginTop: 0,
    alignSelf: 'center',
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
    marginBottom: 0,
    textAlign: 'center',
    opacity: 0.7,
  },
  damageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 2,
    marginTop: 0,
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
  statsContainer: {
    flex: 1,
    padding: 20,
  },
  chartSection: {
    width: '50%',
  },
  playerStatsSection: {
    width: '50%',
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    gap: 8,
  },
  playerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerTitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  const [showDiceModal, setShowDiceModal] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [showDiceSetup, setShowDiceSetup] = useState(false);
  const [diceResults, setDiceResults] = useState<{ [key: number]: number }>({});
  const [showDiceResults, setShowDiceResults] = useState(false);
  const [rollingAnimations] = useState(() => 
    Array(8).fill(null).map(() => new Animated.Value(0))
  );
  const [modeSliders, setModeSliders] = useState<boolean[]>(Array(4).fill(false));
  const [regularLifeTotals, setRegularLifeTotals] = useState<number[]>(Array(4).fill(40));
  const [commanderLifeTotals, setCommanderLifeTotals] = useState<number[]>(Array(4).fill(21));

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
    setLifeTotals(Array(playerCount).fill(40));
    setCommanderTotals(Array(playerCount).fill(21));
    setPlayerStats(initializePlayerStats(playerCount));
    setGameStarted(true);
  };

  const endGame = () => {
    setShowResults(true);
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

  const handleDamageClick = (currentPlayerIndex: number, sourceIndex: number, isCommander: boolean) => {
    // When a player clicks a button, it only affects their own life total
    const damageAmount = 1; // Amount of damage per click

    // Update life totals - only affect the current player's life
    if (isCommander) {
      const newCommanderTotals = [...commanderLifeTotals];
      newCommanderTotals[currentPlayerIndex] = Math.max(0, newCommanderTotals[currentPlayerIndex] - damageAmount);
      setCommanderLifeTotals(newCommanderTotals);
    } else {
      const newRegularTotals = [...regularLifeTotals];
      newRegularTotals[currentPlayerIndex] = Math.max(0, newRegularTotals[currentPlayerIndex] - damageAmount);
      setRegularLifeTotals(newRegularTotals);
    }

    // Record damage dealt/taken
    const updatedStats = [...playerStats];
    if (isCommander) {
      // Current player took damage
      updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] = 
        (updatedStats[currentPlayerIndex].commanderDamageTaken[sourceIndex] || 0) + damageAmount;
      // Source player (button clicked) dealt damage
      updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] = 
        (updatedStats[sourceIndex].commanderDamageDealt[currentPlayerIndex] || 0) + damageAmount;
    } else {
      // Current player took damage
      updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] = 
        (updatedStats[currentPlayerIndex].regularDamageTaken[sourceIndex] || 0) + damageAmount;
      // Source player (button clicked) dealt damage
      updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] = 
        (updatedStats[sourceIndex].regularDamageDealt[currentPlayerIndex] || 0) + damageAmount;
    }
    setPlayerStats(updatedStats);
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

  // Function to generate game results data
  const generateGameResults = () => {
    return JSON.stringify({
      players: playerStats.map((player, index) => ({
        nickname: player.info.nickname || `Player ${index + 1}`,
        colors: player.info.colors,
        finalLife: lifeTotals[index],
        finalCommanderDamage: commanderTotals[index],
        regularDamageDealt: player.regularDamageDealt,
        commanderDamageDealt: player.commanderDamageDealt,
        regularDamageTaken: player.regularDamageTaken,
        commanderDamageTaken: player.commanderDamageTaken,
      })),
      timestamp: new Date().toISOString(),
    });
  };

  // Function to share game results
  const shareGameResults = async () => {
    const results = generateGameResults();
    const gameData = JSON.parse(results);
    
    // Create a formatted text message
    const message = `🎮 Magic: The Gathering Game Results 🎮\n\n` +
      gameData.players.map((player: any, index: number) => {
        const colors = Object.entries(player.colors)
          .filter(([_, selected]) => selected)
          .map(([color]) => color.charAt(0).toUpperCase() + color.slice(1))
          .join(', ');
        
        const totalDamageDealt = Object.values(player.regularDamageDealt as Record<string, number>)
          .reduce((sum, damage) => sum + damage, 0);
        const totalDamageTaken = Object.values(player.regularDamageTaken as Record<string, number>)
          .reduce((sum, damage) => sum + damage, 0);
        
        return `Player ${index + 1}${player.nickname ? ` (${player.nickname})` : ''}:\n` +
          `Colors: ${colors}\n` +
          `Final Life: ${player.finalLife}\n` +
          `Commander Damage: ${player.finalCommanderDamage}\n` +
          `Total Damage Dealt: ${totalDamageDealt}\n` +
          `Total Damage Taken: ${totalDamageTaken}\n`;
      }).join('\n') +
      `\nGame ended at: ${new Date(gameData.timestamp).toLocaleString()}`;

    try {
      await Share.share({
        message,
        title: 'Magic: The Gathering Game Results',
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  const rollDice = () => {
    const result = Math.floor(Math.random() * 20) + 1; // D20 roll
    setDiceResult(result);
    setShowDiceModal(true);
  };

  const renderDiceModal = () => (
    <Modal
      transparent={true}
      visible={showDiceModal}
      animationType="fade"
      onRequestClose={() => setShowDiceModal(false)}
    >
      <TouchableOpacity 
        style={styles.diceModalOverlay}
        activeOpacity={1}
        onPress={() => setShowDiceModal(false)}
      >
        <View style={styles.diceModalContent}>
          <Text style={styles.dicePlayerText}>
            {selectedPlayer !== null && (playerStats[selectedPlayer].info.nickname || `Player ${selectedPlayer + 1}`)}
          </Text>
          <Text style={styles.diceResultText}>{diceResult}</Text>
          <TouchableOpacity
            style={styles.diceRollAgainButton}
            onPress={() => {
              setShowDiceModal(false);
              setTimeout(rollDice, 100);
            }}
          >
            <Text style={styles.diceRollAgainText}>Roll Again</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const startDiceRoll = () => {
    setShowDiceSetup(true);
  };

  const startDiceGame = (count: number) => {
    setPlayerCount(count);
    setShowDiceSetup(false);
    setShowDiceResults(true);
    setDiceResults({});
  };

  const animateDiceRoll = (index: number) => {
    rollingAnimations[index].setValue(0);
    Animated.sequence([
      Animated.timing(rollingAnimations[index], {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(rollingAnimations[index], {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  };

  const rollDiceForPlayer = (playerIndex: number) => {
    animateDiceRoll(playerIndex);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 20) + 1;
      setDiceResults(prev => ({
        ...prev,
        [playerIndex]: result
      }));
    }, 800);
  };

  const renderDiceSetup = () => (
    <View style={styles.setupContainer}>
      <ImageBackground
        source={require('../assets/images/background_img.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(26, 42, 108, 0.7)', 'rgba(45, 45, 77, 0.8)', 'rgba(15, 15, 31, 0.9)']}
          style={styles.gradient}
        >
          <View style={styles.setupContent}>
            <Text style={styles.setupTitle}>Dice Roll</Text>
            <View style={styles.setupForm}>
              <Text style={styles.setupLabel}>Number of Players:</Text>
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
            <TouchableOpacity style={styles.startButton} onPress={() => startDiceGame(playerCount)}>
              <Text style={styles.startButtonText}>Start Dice Roll</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  const renderDiceResults = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2a6c', '#2d2d4d', '#0f0f1f']}
        style={styles.gradient}
      >
        <View style={[styles.playersContainer, landscapeStyles.container]}>
          {Array(playerCount).fill(null).map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.playerBox,
                landscapeStyles.playerBox,
                (index === 1 || index === 3) && landscapeStyles.playerBoxReversed,
                (index === 0 || index === 1) && landscapeStyles.playerBoxFlipped,
                modeSliders[index] && { backgroundColor: 'rgba(255, 0, 0, 0.2)' }
              ]}
            >
              <View style={[styles.playerContent, landscapeStyles.playerContent]}>
                <View style={landscapeStyles.playerHeader}>
                  <TouchableOpacity
                    style={landscapeStyles.playerNameContainer}
                    onPress={() => setEditingPlayer(index)}
                  >
                    <Text style={landscapeStyles.playerTitle}>
                      {playerStats[index].info.nickname || `Player ${index + 1}`}
                    </Text>
                    {renderPlayerColors(playerStats[index].info.colors)}
                  </TouchableOpacity>
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
                </View>

                <View style={landscapeStyles.healthControls}>
                  <TouchableOpacity
                    style={landscapeStyles.healthButton}
                    onPress={() => adjustHealth(index, -1, modeSliders[index])}
                  >
                    <Text style={landscapeStyles.healthButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={landscapeStyles.healthValue}>
                    {modeSliders[index] ? commanderLifeTotals[index] : regularLifeTotals[index]}
                  </Text>
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
                    {Array(4).fill(null).map((_, sourceIndex) => (
                      sourceIndex !== index && (
                        <TouchableOpacity
                          key={sourceIndex}
                          style={landscapeStyles.damageButton}
                          onPress={() => handleDamageClick(index, sourceIndex, modeSliders[index])}
                        >
                          <Text style={landscapeStyles.damageButtonText}>
                            {playerStats[sourceIndex].info.nickname || `Player ${sourceIndex + 1}`}
                          </Text>
                          <Text style={[
                            landscapeStyles.damageAmount,
                            { color: modeSliders[index] ? '#ff6b6b' : '#fff' }
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
          ))}
        </View>
        <View style={[styles.endGameButtonContainer, styles.endGameButtonContainerLandscape]}>
          <TouchableOpacity
            style={styles.endGameButton}
            onPress={endGame}
          >
            <Text style={styles.endGameButtonText}>End Game</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const toggleMode = (index: number) => {
    const newModes = [...modeSliders];
    newModes[index] = !newModes[index];
    setModeSliders(newModes);
  };

  const adjustHealth = (index: number, amount: number, isCommander: boolean) => {
    if (isCommander) {
      const newTotals = [...commanderLifeTotals];
      newTotals[index] = Math.max(0, newTotals[index] + amount);
      setCommanderLifeTotals(newTotals);
    } else {
      const newTotals = [...regularLifeTotals];
      newTotals[index] = Math.max(0, newTotals[index] + amount);
      setRegularLifeTotals(newTotals);
    }
  };

  if (editingPlayer !== null) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a2a6c', '#2d2d4d', '#0f0f1f']}
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
      </View>
    );
  }

  if (showDiceSetup) {
    return renderDiceSetup();
  }

  if (showDiceResults) {
    return renderDiceResults();
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
            colors={['rgba(26, 42, 108, 0.7)', 'rgba(45, 45, 77, 0.8)', 'rgba(15, 15, 31, 0.9)']}
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
                <TouchableOpacity style={styles.startButton} onPress={startDiceRoll}>
                  <Text style={styles.startButtonText}>Dice Roll</Text>
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
          colors={['#1a2a6c', '#2d2d4d', '#0f0f1f']}
          style={styles.gradient}
        >
          <View style={[styles.statsContainer, isLandscape && landscapeStyles.statsContainer]}>
            <Text style={styles.statsTitle}>Game Summary</Text>
            
            {/* Share and QR Code Buttons */}
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

            {/* QR Code Modal */}
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

            {/* Damage Type Toggle */}
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

            {/* Overall Game Chart */}
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

            {/* Player Selection Tabs */}
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

            {/* Selected Player Stats */}
            {selectedPlayer !== null && (
              <ScrollView style={styles.playerStatsScroll}>
                <View style={styles.playerStatsHeader}>
                  <Text style={styles.playerStatsName}>
                    {playerStats[selectedPlayer].info.nickname || `Player ${selectedPlayer + 1}`}
                  </Text>
                  <View style={styles.playerStatsColors}>
                    {renderPlayerColors(playerStats[selectedPlayer].info.colors)}
                  </View>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Damage Dealt:</Text>
                  <Text style={styles.statValue}>
                    {getTotalDamage(selectedPlayer, 'dealt', selectedTab)}
                  </Text>
                </View>

                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Damage Taken:</Text>
                  <Text style={styles.statValue}>
                    {getTotalDamage(selectedPlayer, 'taken', selectedTab)}
                  </Text>
                </View>

                <View style={styles.damageBreakdown}>
                  <Text style={styles.breakdownTitle}>Damage Dealt To:</Text>
                  {Object.entries(selectedTab === 'regular' 
                    ? playerStats[selectedPlayer].regularDamageDealt 
                    : playerStats[selectedPlayer].commanderDamageDealt
                  ).map(([targetIndex, damage]) => (
                    <View key={targetIndex} style={styles.breakdownRow}>
                      <Text style={styles.breakdownText}>
                        {playerStats[parseInt(targetIndex)].info.nickname || `Player ${parseInt(targetIndex) + 1}`}:
                      </Text>
                      <Text style={styles.breakdownValue}>{damage}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.damageBreakdown}>
                  <Text style={styles.breakdownTitle}>Damage Taken From:</Text>
                  {Object.entries(selectedTab === 'regular'
                    ? playerStats[selectedPlayer].regularDamageTaken
                    : playerStats[selectedPlayer].commanderDamageTaken
                  ).map(([sourceIndex, damage]) => (
                    <View key={sourceIndex} style={styles.breakdownRow}>
                      <Text style={styles.breakdownText}>
                        {playerStats[parseInt(sourceIndex)].info.nickname || `Player ${parseInt(sourceIndex) + 1}`}:
                      </Text>
                      <Text style={styles.breakdownValue}>{damage}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}

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
          {renderDiceModal()}
        </LinearGradient>
      </View>
    );
  }

  // If in portrait mode, show the background image
  if (!isLandscape) {
    return (
      <View style={styles.setupContainer}>
        <ImageBackground
          source={require('../assets/images/background_img.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(26, 42, 108, 0.7)', 'rgba(45, 45, 77, 0.8)', 'rgba(15, 15, 31, 0.9)']}
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

  // Only render the game in landscape mode
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a2a6c', '#2d2d4d', '#0f0f1f']}
        style={styles.gradient}
      >
        <View style={[styles.playersContainer, landscapeStyles.container]}>
          {Array(4).fill(null).map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.playerBox,
                landscapeStyles.playerBox,
                (index === 1 || index === 3) && landscapeStyles.playerBoxReversed,
                (index === 0 || index === 1) && landscapeStyles.playerBoxFlipped,
                modeSliders[index] && { backgroundColor: 'rgba(255, 0, 0, 0.2)' }
              ]}
            >
              <View style={[styles.playerContent, landscapeStyles.playerContent]}>
                <View style={landscapeStyles.playerHeader}>
                  <TouchableOpacity
                    style={landscapeStyles.playerNameContainer}
                    onPress={() => setEditingPlayer(index)}
                  >
                    <Text style={landscapeStyles.playerTitle}>
                      {playerStats[index].info.nickname || `Player ${index + 1}`}
                    </Text>
                    {renderPlayerColors(playerStats[index].info.colors)}
                  </TouchableOpacity>
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
                </View>

                <View style={landscapeStyles.healthControls}>
                  <TouchableOpacity
                    style={landscapeStyles.healthButton}
                    onPress={() => adjustHealth(index, -1, modeSliders[index])}
                  >
                    <Text style={landscapeStyles.healthButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={landscapeStyles.healthValue}>
                    {modeSliders[index] ? commanderLifeTotals[index] : regularLifeTotals[index]}
                  </Text>
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
                    {Array(4).fill(null).map((_, sourceIndex) => (
                      sourceIndex !== index && (
                        <TouchableOpacity
                          key={sourceIndex}
                          style={landscapeStyles.damageButton}
                          onPress={() => handleDamageClick(index, sourceIndex, modeSliders[index])}
                        >
                          <Text style={landscapeStyles.damageButtonText}>
                            {playerStats[sourceIndex].info.nickname || `Player ${sourceIndex + 1}`}
                          </Text>
                          <Text style={[
                            landscapeStyles.damageAmount,
                            { color: modeSliders[index] ? '#ff6b6b' : '#fff' }
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
          ))}
        </View>
        <View style={[styles.endGameButtonContainer, styles.endGameButtonContainerLandscape]}>
          <TouchableOpacity
            style={styles.endGameButton}
            onPress={endGame}
          >
            <Text style={styles.endGameButtonText}>End Game</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    padding: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  playerBoxLandscape: {
    width: '48%',
    marginHorizontal: '1%',
  },
  playerTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2,
    gap: 4,
  },
  toggleButton: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: '#fff',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 11,
  },
  lifeTotalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  lifeTotal: {
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  adjustmentButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 4,
  },
  adjustButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 14,
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
    gap: 5,
    marginTop: 2,
  },
  damageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
    minWidth: 70,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  damageButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    opacity: 0.7,
  },
  damageAmount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
    opacity: 0.7,
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
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    gap: 8,
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
  statsContainer: {
    flex: 1,
    padding: 20,
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
  newGameButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
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
  diceModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diceModalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  diceResultText: {
    fontSize: 72,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  diceRollAgainButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  diceRollAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  diceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  diceResultDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: 120,
    height: 120,
  },
  diceRollButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceRollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerContent: {
    flex: 1,
  },
  portraitMessage: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: '20%',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  dicePlayerText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
});




