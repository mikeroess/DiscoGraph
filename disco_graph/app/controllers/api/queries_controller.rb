class Api::QueriesController < ApplicationController

  def genre_query
    api_token = ENV["api_token"]
    releases = {}
    genre = params["genre"]
    start_year = params["startYear"]
    end_year = params["endYear"]
    releases[genre] = {}
    (start_year..end_year).each do |year|
      response = HTTParty
        .get("https://api.discogs.com/database/search?year=#{year}&genre=#{genre}&token=#{api_token}&per_page=1&page=1",
        :headers => {"User-Agent": "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/"})
      releases[genre][year] = response["pagination"]["items"]
    end
    render json: releases
  end


  def sub_genre_query
    api_token = ENV["api_token"]
    releases = {}
    sub_genre = params["sub_genre"]
    start_year = params["startYear"]
    end_year = params["endYear"]
    releases[sub_genre] = {}
    (start_year..end_year).each do |year|
      response = HTTParty.get("https://api.discogs.com/database/search?year=#{year}&style=#{sub_genre}&token=#{api_token}&per_page=1&page=1",
      :headers => {"User-Agent": "DiscoGraph/0.1 + https://mikeroess.github.io/DiscoGraph/"})
      releases[sub_genre][year] = response["pagination"]["items"]
    end
    render json: releases
  end

end
