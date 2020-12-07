const dataUrl = "samples.json";

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
        console.log("filterSamples:",filterSamples);

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
            xaxis: {title: "Sample Values"},
        };

        // plot the bar chart to the div
        Plotly.newPlot("bar",barData,barLayout);

    // BUBBLE CHART

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