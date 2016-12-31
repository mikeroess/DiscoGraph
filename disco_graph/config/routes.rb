Rails.application.routes.draw do
  root "static_pages#root"

  namespace :api, defaults: {format: :json} do
    resource :queries, only: [:show]
  end

  get 'api/genreQuery', to: 'api/queries#genre_query'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
