/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View
} from 'react-native';

class Button extends Component {
    render() {
      buttonStyle = this.props.buttonStyle ?
                      this.props.buttonStyle :
                      (this.props.callout ?
                       styles.blueButton: styles.greyButton);
      return (
        <TouchableHighlight
            onPress={this.props.onPress}
            style={buttonStyle}>
            <Text style={this.props.callout ?
                        styles.blueButtonText: styles.greyButtonText}>
            {this.props.text} </Text>
        </TouchableHighlight>
      );
    }
}

class Screen_Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          How long has it been since the patient
          suffered the burn?
        </Text>
        <Button text="Less than 3 hours"
                onPress={() => this.props.switcher(screens.wash)}
                callout = {true}>
        </Button>
        <Button text="3 hours or more"
                onPress={() => this.props.switcher(screens.degree)} />
      </View>
    );
  }
}

class Screen_Wash extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Please put the burned part under running water.
        </Text>
        <Image source={require('./img/wash.png')}/>
        <Button text="Done"
                onPress={() => this.props.switcher(screens.timer)}
                callout = {true}/>
      </View>
    );
  }
}

class Screen_Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {seconds: 1800}; // thirty minutes
    //TODO: deal with dismount
    setInterval(() => {
        if (this.state.seconds > 0) {
            this.setState({seconds: this.state.seconds - 1});
        }
    }, 1000);
  }
  render() {
    minutes = Math.floor(this.state.seconds / 60);
    seconds = Math.floor(this.state.seconds % 60);
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Keep the burned part under running water
          for 30 minutes.
        </Text>
        <View style={styles.timerSection}>
          <Image style={styles.timerImage}
                 source={require('./img/timer.png')}/>
          <View style={styles.timerTextContainer}>
            <Text style={styles.timerText}> {minutes} : {seconds} </Text>
          </View>
        </View>
        <Text>
        Timer alarm will sound in
        {(minutes > 0) ? " " + minutes + " minutes"
                       : " " + seconds + " seconds"}.
        </Text>
        <Button text = "Continue Data Collection"
                onPress={() => this.props.switcher(screens.degree)}
                callout = {seconds == 0}/>
      </View>
    );
  }
}

class Screen_Question extends Component {
  render() {
      return (<View style={style.container}>
                <Text> What should appear on this screen? </Text>
              </View>);
  }
}

class Screen_Data extends Component {
  render() {
      return (
        <ScrollView>
          <Text style={styles.headerNoMargin}>
            Patient Information
          </Text>
          <View style={styles.container}>
            <View style={styles.inputRow}>
                <Text> Name </Text>
                <TextInput
                    style={{height:40}}
                    onChange={(text) => this.setState({name: text})} />
            </View>
            <View style={styles.inputRow}>
                <Text> Phone # </Text>
                <TextInput
                    style={{height:40}}
                    keyboardType='numeric'
                    maxLength={10}
                    onChange={(text) => this.setState({number: text})} />
            </View>
            <View style={styles.inputRow}>
                <Text> Weight (kgs) </Text>
                <TextInput
                    style={{height:40}}
                    keyboardType='numeric'
                    onChange={(text) => this.setState({number: text})} />
            </View>
          </View>
        </ScrollView>
      );
  }
}

class Screen_Degree extends Component {
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerNoMargin}>
            What degree is the burn?
          </Text>
          <Image style={styles.imageDegree}
                 source={require('./img/degree1.png')}/>
          <Button text="First Degree"
                 buttonStyle={styles.degreeButton}
                 onPress = {() => this.props.switcher(screens.question)}/>
          <Image style={styles.imageDegree}
                 source={require('./img/degree2.png')}/>
          <Button text="Second Degree"
                 buttonStyle={styles.degreeButton}
                 onPress = {() => this.props.switcher(screens.extent)}/>
          <Image style={styles.imageDegree}
                 source={require('./img/degree3.png')}/>
          <Button text="Third Degree"
                 buttonStyle={styles.degreeButton}
                 onPress = {() => this.props.switcher(screens.extent)}/>
        </View>
      </ScrollView>

    );
  }
}

class Screen_Extent extends Component {
  constructor(props) {
      super(props);
      this.state = {selected: false};
  }
  text() {
      if (this.state.selected)
          return (<Button text="Those are all the parts that have suffered burns."
                         onPress={() => this.props.switcher(screens.data)} />);
      else
          return (<Text> Please click everywhere there is burning. </Text>);
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerNoMargin}>
            Where is the burn?
          </Text>
          <TouchableHighlight
            onPress={() => {this.setState({selected: true})}}>
            <Image style={styles.timerImage}
                   source={require('./img/diagram.png')}/>
          </TouchableHighlight>
          {this.text()}
        </View>
      </ScrollView>

    );
  }
}

class Burn extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{screen: screens.home}}
                renderScene={(route, navigator) => {
                    var switcher = function(screen) {
                        navigator.push({screen: screen});
                    }
                    switch(route.screen) {
                        case screens.home:
                            return <Screen_Home switcher={switcher} />;
                        case screens.data:
                            return <Screen_Data switcher={switcher} />;
                        case screens.degree:
                            return <Screen_Degree switcher={switcher} />;
                        case screens.extent:
                            return <Screen_Extent switcher={switcher} />;
                        case screens.question:
                            return <Screen_Question switcher={switcher} />;
                        case screens.timer:
                            return <Screen_Timer switcher={switcher} />;
                        case screens.wash:
                            return <Screen_Wash switcher={switcher} />;
                        default:
                            return <Screen_Home switcher={switcher} />;
                    }
                }}
            />
        );
    }
}

const screens = {
    home: 'home',
    data: 'data',
    degree: 'degree',
    extent: 'extent',
    question: 'question',
    timer: 'timer',
    wash: 'wash',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCF5',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom:80,
  },
  headerNoMargin: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'justify',
    justifyContent: 'justify',
  },
  greyButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#F5F5F5'
  },
  greybuttonText: {
    fontSize: 14,
    color: '#111',
    fontWeight: 'bold',
  },
  blueButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#04B9E6',
  },
  blueButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  /* Timer Page */
  timerSection: {
  },
    timerImage: {
      zIndex: -1,
      width: 200,
      height: 226,
    },
    timerText: {
      fontSize: 30,
      fontFamily: 'Courier New',
    },
    timerTextContainer: {
      /* place on top left, perfectly over image */
      position: 'absolute',
      top: 0,
      left: 0,
      width: 200,
      height: 226,
      zIndex: 100,
      /* make sure text is dead center */
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
  /* Degree page */
  imageDegree: {
      width: 100,
      height: 100,
      margin:10,
  },
  degreeButton: {
    padding: 10,
    backgroundColor: '#F5F5F5'
  },
});

AppRegistry.registerComponent('Burn', () => Burn);
