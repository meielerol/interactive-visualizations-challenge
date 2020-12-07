const dataUrl = "/data/samples.json";

// read in the samples.json data
d3.json(dataUrl).then(function(data){
    console.log(`dataUrl: ${dataUrl}`,data);
});

// build the sample demographic info
function sampleDemographicInfo(subjectID){
    // transform the data from a string to an integer because metadata has it saved as an integer
    subjectID = parseInt(subjectID);

    // select the demographic info panel
    let demoInfo = d3.select("#sample-metadata");

    // clear existing data on the panel
    demoInfo.html("");

    // info needed to gather: id, ethnicity, gender, age, lcoation, bbtype, wfreq
    d3.json(dataUrl).then(data => {
        // get the metadata part of data
        let metadata = data.metadata;
        // console.log("metadata",metadata);

        // filters the metadata based on the sampleID requested
        // returns the index and then returns the info
        let filterMetadata = metadata[metadata.findIndex(element => element.id === subjectID)];
        // console.log("filterMetadata:",filterMetadata);

        // Object.entries() returns array of give objects string-keyed property [key, value]
        Object.entries(filterMetadata).forEach(([key,value]) =>{
            // append the items inside the #sample-meta div and add the metadata for each key-value pairing
            demoInfo.append("p")
                .text(`${key}: ${value}`);
        }); //end Object.entries().forEach() function
    }); //end d3.json()
};  //end sampleDemographicInfo function

// build the sample charts
function sampleCharts(subjectID){
    // keep the subjectID as string because samples has it saved as a string not integer
    // console.log("chart subjectID",subjectID);

    // collect the data for the selected subjectID
    d3.json(dataUrl).then(data => {
        // get the data for the charts
        let samples = data.samples;
        // console.log("samples data:",samples);
        let filterSamples = samples[samples.findIndex(element => element.id === subjectID)];
        // console.log("filterSamples:",filterSamples);

        // retrieve the arrays of data
        let otuIDs = filterSamples.otu_ids;
        let otuLabels = filterSamples.otu_labels;
        let sampleValues = filterSamples.sample_values; //already in descending order


    // HORIZONTAL BAR CHART
        // top 10 data for the bar chart
        let bar_xData = sampleValues.slice(0,10).reverse();
        let bar_yData = otuIDs.slice(0,10).reverse();
        let bar_textData = otuLabels.slice(0,10).reverse();

        // create the data[{trace}]
        let barData = [{
            type:"bar",
            orientation:"h",
            x: bar_xData,
            y: bar_yData
                .map(id => `OTU ${id}`),
            text: bar_textData            
        }];
        // create the layout
        let barLayout = {
            title: "Top 10 Operational Taxonomic Units",
            xaxis: {title: "Sample Values"}
        };

        // plot the bar chart to the div
        Plotly.newPlot("bar",barData,barLayout);

    // GAUGE CHART
        // get the wash frequency
        let metadata = data.metadata;
        let washFreq = metadata[metadata.findIndex(element => element.id === parseInt(subjectID))].wfreq;
        // console.log("wash frequency",washFreq);

        // create the data[{trace}]
        let gaugeData = [{
            domain: {
                x: [0,1],
                y: [0,1]
            },
            value: washFreq,
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {range: [null,9]},
                steps: [
                    {range: [0,1], color: "#f0f5f5"},
                    {range: [1,2], color: "#e0ebeb"},
                    {range: [2,3], color: "#d1e0e0"},
                    {range: [3,4], color: "#c2d6d6"},
                    {range: [4,5], color: "#b3cccc"},
                    {range: [5,6], color: "#a3c2c2"},
                    {range: [6,7], color: "#94b8b8"},
                    {range: [7,8], color: "#85adad"},
                    {range: [8,9], color: "#75a3a3"}
                ],
                bar: {color: "476b6b"}
            }
        }];
        // create the layout
        let gaugeLayout = {
            title: "<b>Washing Frequency</b><br>Scrubs per Week"
        };
        
        Plotly.newPlot("gauge",gaugeData,gaugeLayout);

    // BUBBLE CHART
        // create the data[{trace}]
        let bubbleData = [{
            mode: "markers",
            x: otuIDs,
            y: sampleValues,
            marker: {
                size: sampleValues,
                color: otuIDs,
                colorscale: "Earth" //https://plotly.com/javascript/colorscales/
            },
            text: otuLabels
        }];
        // create the layout
        let bubbleLayout = {
            title: "All Operational Taxonomic Units",
            xaxis: {title: "OTU ID"},
        };

        // plot the bubble chart to the div
        Plotly.newPlot("bubble",bubbleData,bubbleLayout);

    }); //end d3.json()
};  //end sampleCharts function

// initialize the page with the default selection
function init() {
    // grab the dropdown menu element reference
    let subjectIDDropdown = d3.select("#selDataset")
    // console.log("selected ID:",subjectID);

    // fill the dropdown menu with options
    d3.json(dataUrl).then(data => {
        subjectName = data.names;
        // console.log("names",sampleName);

        subjectName.forEach(name => {
            subjectIDDropdown.append("option")
                .text(name)
                .property("value",name);
        }); //end of filling dropdown with the test subject IDs

        // use the first sample to create the landing page info
        const initialSubjectID = subjectName[0];
        // console.log("first sample:",initialSample);

        // call functions to build sample demographic info & sample charts
        sampleDemographicInfo(initialSubjectID);
        sampleCharts(initialSubjectID);
    }); //end d3.json() promise
};  //end initialization function

// handle when the selected subjectID is changed in the dropdown
function optionChanged(newSubjectID){
    sampleDemographicInfo(newSubjectID);
    sampleCharts(newSubjectID);
};  //end optionChanged function

// call initialization
init();