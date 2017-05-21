import * as THREE from 'three';

import React, { Component, PropTypes } from 'react';
import NewPlantModel from './NewPlantModel';
import { connect } from 'react-redux';
import store from '../store';

console.log("Store in MaterialGrid.js", store.getState())
console.log("store {} ", {store})

class ThreePlantGrid extends React.Component {

    constructor(props, context) {
      super(props,context)
      this.plantGrid = store.getState().gardenReducer.plantGrid

    }


    render() {
      return (
        <group>
          {this.plantGrid.map((newPlantModel, i) => {
            if (newPlantModel.model in this.cache) {
              return(<NewPlantModel key={i}
              position={new THREE.Vector3(
                newPlantModel.x * 2 - 500,
                0,
                newPlantModel.y * 2 - 500
              )}
              daeFile = {this.cache[newPlantModel.model]}
            />)
            } else {
                let newPlantModelDae = newPlantModel.model;
                this.cache[newPlantModelDae] = newPlantModelDae;
               return(<NewPlantModel key={i}
              position={new THREE.Vector3(
                newPlantModel.x * 2 - 500,
                0,
                newPlantModel.y * 2 - 500
              )}
              daeFile = {newPlantModel.model}
            />)
             }
             }
          )}
        </group>
      )
    }
}

export default(ThreePlantGrid)