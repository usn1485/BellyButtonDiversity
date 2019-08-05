function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

      // Use`d 3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then((metadata) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL= d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    PANEL.html("");    
    debugger
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(metadata).forEach(([key, value]) => {
      // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        PANEL.append("h6").text(`${key}:${value}`);                         
                
         });
   


  //********** */ BONUS: Build the Gauge Chart*********************//
    // buildGauge(data.WFREQ);
    // Enter a speed between 0 and 180
  //console.log(metadata)
  var level = metadata.WFREQ ;

  // Trig to calc meter point
  var degrees = 180 - (level*15),
      radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
      x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'BellyButtonDiversity ',
      text: level,
      hoverinfo: 'text+name'},
    { values: [50/9,50/9,50/9,50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9','7-8','6-7', '5-6', '4-5', '3-4',
              '2-3', '1-2', '0-1',''],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                          'rgba(192,192,192,0.3)','rgba(255,0,0,0.3)',
                          'rgba(0,0,255,0.3)','rgba(255, 255, 255, 0)']},
    //labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
    //hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week.',
    height: 600,
    width: 680,
    xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);
  });
      
  }
//******************************************************
function buildCharts(sample) {
   console.log("buildchart function triggered")
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    
      var url= `/samples/${sample}`;
      console.log("url is "+ url);

     // @TODO: Build a Bubble Chart using the sample data
      d3.json(url).then(function(response){
        var trace = {
          type: "Scatter",
          name: "Belly Button Bubble Chart",
          x: response.otu_ids,
          y: response.sample_values,
          //title: '<b>OTU ID</b>',
          mode:'markers',
          marker:{
            color:response.otu_ids,
            size:response.sample_values
           },          
          hovertext:response.otu_labels
          
        };
        // debugger
        var data = [trace];
    
        var layout = {
          //title: "Belly Button Diversity Bubble Chart",
          
        };
    
        Plotly.newPlot("bubble", data, layout);
    
      });

    // @TODO: Build a Pie Chart
      d3.json(url).then(function(response){
      var trace={
       lables:response.otu_ids.slice(0,10),
       values:response.sample_values.slice(0,10),
       type: 'pie',
       hovertext:response.otu_labels
      };
      
      data=[trace]
      Plotly.newPlot('pie', data);

      });
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log("New Data selected");
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
