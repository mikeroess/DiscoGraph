const prefetchData1 = function () {
    let data = {'genre': "hip-hop", 'startYear': 1960, 'endYear': 2016};
        genreQuery(data).then(
          (response) => {
            localStorage.setItem("hip-hop", JSON.stringify(response['hip-hop']));
            let data = {'genre': "electronic", 'startYear': 1960, 'endYear': 2016};
            genreQuery(data).then(
              (response) => {
                localStorage.setItem("electronic", JSON.stringify(response['electronic']));
              },
              (error) => console.log(error)
            );
          },
      (error) => console.log(error)
      );
};


const prefetchData2 = function () {
    let data = {'genre': "pop", 'startYear': 1960, 'endYear': 2016};
    genreQuery(data).then(
      (response) => {
        localStorage.setItem("pop", JSON.stringify(response['pop']));
        let data = {'genre': "funk-soul", 'startYear': 1960, 'endYear': 2016};
        genreQuery(data).then(
          (response) => {
            localStorage.setItem("funk-soul", JSON.stringify(response['funk-soul']));
          },
      (error) => console.log(error)
      );
      },
    (error) => console.log(error)
);
};
  // const prefetchData2 = function (startYear, endYear) {
  //   let data = {'genre': "pop", 'startYear': startYear, 'endYear': endYear};
  //   genreQuery(data).then(
  //     (response) => {
  //       localStorage.setItem("pop", JSON.stringify(response['pop']))
  //       ;
  //     },
  //     (error) => console.log(error)
  //   );
  // }

  // const clearAndFetchData = () => {
  //   return genreQuery({'genre': "rock", 'startYear': 1950, 'endYear': 2016}).then(
  //     (response) => {
  //       localStorage.setItem("rock", JSON.stringify(response["rock"]));},
  //     (err) => console.log(err)
  // };


      // (genreQuery({'genre': "pop", 'startYear': 1950, 'endYear': 2016}).then(
      //   (response) => {
      //     localStorage.setItem("pop", JSON.stringify(response["pop"]));},
      //   (err) => console.log(err)
      //
      // (genreQuery({'genre': "hip-hop", 'startYear': 1950, 'endYear': 2016}).then(
      //   (response) => {
      //     localStorage.setItem("hip-hop", JSON.stringify(response["hip-hop"]));
      //   },
      //   (err) => console.log(err)
