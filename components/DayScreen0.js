import React, { Component } from 'react';
import { Alert, StyleSheet, ScrollView, ActivityIndicator, Image, View, TouchableOpacity, Text } from 'react-native';
import { List, ListItem, Button, Icon } from 'react-native-elements';
import { VictoryBar, VictoryLine, VictoryArea, VictoryChart, VictoryStack, VictoryScatter, VictoryTheme, VictoryAxis, LineSegment, VictoryLabel } from 'victory-native';
import styles from './style';


 class DayDetail extends Component {
   constructor(props) {
     super();
   }

   render () {
     //Set up stack daily view sleep data
     let ySleep = [];
     let in_out = [];
     for (i=0; i<this.props.boards[this.props.picked].enters.length; i++) {
       //Set x and y data arrays
       if (this.props.boards[this.props.picked].exited[i]) {
         //For line graph
         in_out.push("1"); //1 represents in bed
         ySleep.push(new Date(this.props.boards[this.props.picked].enters[i]));
         in_out.push("0");
         ySleep.push(new Date(this.props.boards[this.props.picked].exited[i]));
       }
     }
     //If no data for sleep, set up fake data
     if (ySleep.length == 0) {
       ySleep = [new Date(), new Date()];
       in_out = [0, 0]
     }
     let sleepData = [];
     for (i=0; i<ySleep.length; i++) {
       sleepData.push({x: ySleep[i], y: in_out[i]});
       //ySleep[i] = ySleep[i].getTime();
     }
     let restlessData = [];
     for (i=0; i<this.props.boards[this.props.picked].restNum.length; i++) {
       restlessData.push({x: this.props.boards[this.props.picked].restTime[i], y: this.props.boards[this.props.picked].restNum[i]});
     }

     //Set up labels for sleep chart
     let label1 = ySleep[0];
     let label4 = ySleep[ySleep.length-1];
     let increment = Math.floor((ySleep[ySleep.length-1].getTime()-ySleep[0].getTime())/3);
     let label2 = new Date(label1.getTime() + increment);
     let label3 = new Date(label2.getTime() + increment);
     let sleepLabel = [label1, label2, label3, label4];

     //Set up labels for restlessness
     let restlessLabel = []
     //Add to array if restlessness is longer than 1 hour
     if ((this.props.boards[this.props.picked].restTime[this.props.boards[this.props.picked].restTime.length-1].getTime() - this.props.boards[this.props.picked].restTime[0].getTime()) <= 60000) {
      label1 = this.props.boards[this.props.picked].restTime[0];
      label4 = this.props.boards[this.props.picked].restTime[this.props.boards[this.props.picked].restTime.length-1];
      increment = Math.floor((this.props.boards[this.props.picked].restTime[this.props.boards[this.props.picked].restTime.length-1].getTime()-this.props.boards[this.props.picked].restTime[0].getTime())/3);
      label2 = new Date(label1.getTime() + increment);
      label3 = new Date(label2.getTime() + increment);
      restlessLabel = [label1, label2, label3, label4];
     }

     //Build text to display for bedwetting table
     let bedWetContent;
     if(this.props.boards[this.props.picked].bedwet.length > 0){
       let wetTime = new Date(this.props.boards[this.props.picked].bedwet[0]);
       bedWetContent = "Wet     " + this.props.formatTime(wetTime) ;
     }
     else {
       bedWetContent = "Dry";
     }

    return(
      <View>
      {this.props.tutorial ?
        <Text style={styles.smallText}>{"\n"}Click the i again to hide this text. {"\n"}
        This is the daily view, it shows
        more detailed information about the same metrics shown on the weekly page.
        Scroll through and have a look! You can scroll through the days with the
        arrows below. After you have seen a couple of days click on Month above.
      </Text> : ""}
        <View style={styles.triplet}>
          <Button
            buttonStyle={{ marginTop:  30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-back', style: { marginRight: 0, fontSize: 28, color: 'black'} }}
            onPress={() => this.props.changePicked(-1)}
          />
          <Text style={styles.blackText}>{"\n"}{this.props.boards[this.props.picked].day}</Text>
          <Button
            buttonStyle={{ marginTop: 30, backgroundColor: 'transparent' }}
            icon={{ name: 'arrow-forward', style: { marginRight: 0, fontSize: 28, color: 'black'} }}
            onPress={() => this.props.changePicked(1)}
          />
        </View>
        <View style={styles.appContainer}>
          <TouchableOpacity
            onPress={() => {Alert.alert('Shaded = time in bed asleep \n Unshaded = time out of bed')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Sleep: {this.props.hrToMin((this.props.boards[this.props.picked].sleep).toFixed(2))}</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>

        {this.props.tutorial ?
          <Text style={styles.smallText}>Last night's sleep, blue is time asleep and white is time out of bed.
          </Text> : ""}
        <VictoryChart
          height={130}
          scale={{x: 'time', y: 'linear'}}
          domain={{x: [ySleep[0], ySleep[ySleep.length-1]], y: [1.1, 2]}}
          >
          <VictoryArea
            data={sleepData}
              x="x" y="y"
            interpolation="stepBefore"
            style={{
              data: { stroke: "steelblue", fill: "steelblue" },
            }}
            />
          <VictoryAxis
            label="Time"
            tickFormat={(d) => this.props.formatTime(d)}
            tickValues={sleepLabel}
            style={{fontSize: 16, axisLabel: { padding: 35 },
                ticks: {stroke: "black", size: 7},
              }}
            fixLabelOverlap
            />

        </VictoryChart>

        <View style={styles.appContainer}>
        <Text>{'\n'}</Text>
          <TouchableOpacity
            onPress={() => {Alert.alert('Movement on a scale of 0 (low) - 10 (high)')}}
            style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Movement</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        {this.props.tutorial ?
          <Text style={styles.smallText}>Restless illustrates how much your child
            moved while sleeping. It is divided into low, normal, and high indicating
            the relative amount of movement.
          </Text> : ""}
        <Text style={styles.brightText}>{this.props.restlessDescription} : {this.props.avgRestless}</Text>
        //Line graph of restlessness
        <VictoryChart
          height={150}
          domainPadding={{ x : [20, 20] }}
          scale={{ x: "time" }}
          >
          <VictoryLine
            interpolation="natural"
            style={{
              data: { stroke: "steelblue" },
            }}
            data = {restlessData}
            />
          <VictoryAxis
            label={"Time"}
            tickFormat={(d) => this.props.formatTime(d)}
            tickValues={restlessLabel}
            style={{fontSize: 16, axisLabel: { padding: 35 },
                ticks: {stroke: "black", size: 7},
              }}
            fixLabelOverlap
            />
          <VictoryAxis dependentAxis
            label="Low     High"
            style={{
              axisLabel: { padding: 10},
              fontSize: 16,
              transform: [{ rotate: '90deg'}]
            }}
            tickFormat={() => ''}
            />
        </VictoryChart>

        <View style={styles.appContainer}>
        <Text>{'\n'}</Text>
        <TouchableOpacity
          onPress={() => {Alert.alert('Times of bed wets')}}
          style={styles.button1}>
            <View style={styles.btnContainer}>
              <Text style={styles.title}>Bedwets</Text>
              <Image source={require('./about.png')} style={styles.icon} />
            </View>
          </TouchableOpacity>
        </View>
        {this.props.tutorial ?
          <Text style={styles.smallText}>Displays the time of a bedwetting incident.
          </Text> : ""}
        <Text style={styles.brightText}>{bedWetContent}</Text>

        //Table for bed exits
        <View style={styles.appContainer}>
        <Text>{'\n'}</Text>
        <TouchableOpacity
          onPress={() => {Alert.alert('Times and durations of bed exits')}}
          style={styles.button1}>
          <View style={styles.btnContainer}>
            <Text style={styles.title}>Bed Exits</Text>
            <Image source={require('./about.png')} style={styles.icon} />
          </View>
        </TouchableOpacity>
        </View>
        {this.props.tutorial ?
          <Text style={styles.smallText}>Displays the time and duration of exits.
          </Text> : ""}
        <Text style={styles.brightText}>Time{'\t\t'}  Minutes</Text>
        // This code for rendering table is from:
        // https://stackoverflow.com/questions/44357336/setting-up-a-table-layout-in-react-native
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {
            this.props.boards[this.props.picked].exited.map((time, index) => { // This will render a row for each data element.
              if (this.props.boards[this.props.picked].exited.length <= 1 || this.props.boards[this.props.picked].exited == undefined) {
                return (
                    <Text key={time} style={styles.brightTextLeft}>
                      {'                         '}{'--'}{'                     '}{'--'}
                    </Text>
                );
              }
              else if (index != this.props.boards[this.props.picked].exited.length-1){
                var exitTime = new Date(time);
                var enterTime = new Date(this.props.boards[this.props.picked].enters[index + 1]);
                var dif = new Date(enterTime-exitTime);
                var timeOut = dif / (60000);
                return (
                    <Text key={time} style={styles.brightTextLeft}>
                      {'                   '}{this.props.formatTime(exitTime)}{'           '}{(this.props.minToSec(timeOut))}
                    </Text>
                );
              }
            })
          }
        </View>
        {this.props.tutorial ?
          <Text style={styles.smallText}>Scroll back to the top and check out the monthly view!
          </Text> : ""}
        </View>);

  }
}

export default DayDetail;