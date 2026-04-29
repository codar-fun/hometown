Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Auth
  resource  :identification, only: [ :new, :create ]
  resource  :verification,   only: [ :new, :create ]
  delete    "sign_out",      to: "sessions#destroy", as: :sign_out

  # User profiles
  resources :profiles, only: [ :show, :edit, :update ]

  # Public forms and submissions
  resources :forms, only: [ :show ], param: :slug do
    resources :form_submissions, only: [ :new, :create ], shallow: true
  end
  resources :form_submissions, only: [ :show ]

  # Admin namespace
  namespace :admin do
    root to: "dashboard#index"
    resources :forms do
      member do
        patch :publish
        patch :unpublish
      end
      resources :form_fields, only: [ :create, :update, :destroy ] do
        collection { patch :reorder }
      end
      resources :form_submissions, only: [ :index, :show ] do
        member do
          patch :approve
          patch :reject
        end
      end
    end
  end

  root to: "home#index"
end
