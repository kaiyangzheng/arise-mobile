// @ts-nocheck

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TouchableOpacityGrid = ({ handleTilePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <TouchableOpacity
            key={number}
            style={styles.gridItem}
            onPress={() => handleTilePress(number)}
          >
            <Text style={styles.gridItemText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    width: 100,
    height: 100,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  gridItemText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default TouchableOpacityGrid;