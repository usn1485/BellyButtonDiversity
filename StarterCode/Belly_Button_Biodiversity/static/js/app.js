function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

      // Use`d 3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL= d3.select('#sample-metadata');
    // Use `.html("") to clear any existing metadata
    PANEL.html("");    
    //debugger
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => {
      // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        PANEL.append("h6").text(`${key}:${value}`);                         
                
         });
    });
  // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    
}

function buildCharts(sample) {
   console.log("buildchart function triggered")
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    
      var url= `/samples/${sample}`;
      console.log("url is "+ url);

     // @TODO: Build a Bubble Chart using the sample data
      d3.json(url).then(function(response){
        var trace = {
          type: "Scatter",
          name: "BellyButton BubbleChart",
          x: response.otu_ids,
          y: response.sample_values,
          title: '<b>OTU ID</b>',
          mode:'markers',
          marker:{
            color:response.otu_ids,
            size:response.sample_values
           },          
          text:response.otu_labels
          
        };
        // debugger
        var data = [trace];
    
        var layout = {
          title: "BellyButton Diversity BubbleChart",
          
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
