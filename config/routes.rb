Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Auth
  resource  :identification, only: [ :new, :create ]
  resource  :verification,   only: [ :new, :create ]
  delete    "sign_out",      to: "sessions#destroy", as: :sign_out

  # Public community pages
  resources :events,   only: [ :index ]
  resources :projects, only: [ :index, :show, :new, :create ]
  resources :members,  only: [ :index ]
  resources :teams, only: [ :index, :show, :new, :create, :edit, :update ] do
    resources :team_members, only: [ :create, :destroy ]
  end

  # User profiles
  resources :profiles, only: [ :show, :edit, :update ]

  # Contact binding (add/update email or phone with OTP verification)
  resources :login_bindings, only: [ :new, :create ] do
    collection do
      get  :verify
      post :verify
    end
  end

  # Public forms and submissions
  resources :forms, only: [ :show ], param: :slug do
    resources :form_submissions, only: [ :new, :create ], shallow: true
  end
  resources :form_submissions, only: [ :show ]

  # Admin namespace
  namespace :admin do
    root to: "dashboard#index"

    resources :hackathons do
      member do
        patch :publish
        patch :unpublish
      end
    end

    resources :forms do
      member do
        patch :publish
        patch :unpublish
      end
      resources :form_fields, only: [ :create, :update, :destroy ] do
        collection { patch :reorder }
      end
    end

    resources :form_submissions, only: [ :index, :show ] do
      member do
        patch :approve
        patch :reject
        patch :star
      end
    end

    resource :email_preview, only: [ :show ]
  end

  root to: "home#index"
end
