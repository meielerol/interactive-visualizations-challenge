const dataUrl = "samples.json";

// read in the samples.json data
d3.json(dataUrl).then(function(data){
    console.log(`dataUrl: ${dataUrl}`,data);
});

// build the sample demographic info
function sampleDemographicInfo(sampleID){
    // transform the data from a string to an integer
    sampleID = parseInt(sampleID);

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
        let filterMetadata = metadata[metadata.findIndex(element => element.id === sampleID)];
        console.log("filterMetadata:",filterMetadata);

        // Object.entries() returns array of give objects string-keyed property [key, value]
        Object.entries(filterMetadata).forEach(([key,value]) =>{
            // append the items inside the #sample-meta div and add the metadata for each key-value pairing
            demoInfo.append("p")
                .text(`${key}: ${value}`);
        }); //end Object.entries().forEach() function
    }); //end d3.json()
};  //end sampleDemographicInfo function

// build the sample charts
function sampleCharts(sampleID){

};  //end sampleCharts function

// initialize the page with the default selection
function init() {
    // grab the dropdown menu element reference
    let subjectIDDropdown = d3.select("#selDataset")
    // console.log("selected ID:",subjectID);

    // fill the dropdown menu with options
    d3.json(dataUrl).then(data => {
        sampleName = data.names;
        // console.log("names",sampleName);

        sampleName.forEach(name => {
            subjectIDDropdown.append("option")
                .text(name)
                .property("value",name);
        }); //end of filling dropdown with the test subject IDs

        // use the first sample to create the landing page info
        const initialSample = sampleName[0];
        // console.log("first sample:",initialSample);

        // call functions to build sample demographic info & sample charts
        sampleDemographicInfo(initialSample);
        sampleCharts(initialSample);
    }); //end d3.json() promise
};  //end initialization function

// handle when the selected subjectID is changed in the dropdown
function optionChanged(changedSample){
    sampleDemographicInfo(changedSample);
    sampleCharts(changedSample);
};  //end optionChanged function

// call initialization
init();