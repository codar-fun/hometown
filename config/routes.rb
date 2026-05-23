Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  # Auth
  resource  :identification, only: [ :new, :create ]
  resource  :verification,   only: [ :new, :create ]
  resource  :handle,         only: [ :new, :create ]
  delete    "sign_out",      to: "sessions#destroy", as: :sign_out

  # Semi OAuth2
  get  "auth/semi",  to: "semi_oauth#login",    as: :semi_oauth_login
  get  "callback",   to: "semi_oauth#callback",  as: :semi_oauth_callback

  # Public community pages
  resources :events,   only: [ :index ]
  resources :projects, only: [ :index, :show, :new, :create, :edit, :update, :destroy ] do
    member do
      post :star
      post :submit
      post :approve
      post :reject
    end
  end
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
  resources :form_submissions, only: [ :show, :edit, :update ]

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
        get :export_submissions
      end
      resources :form_fields, only: [ :create, :update, :destroy ] do
        collection { patch :reorder }
      end
    end

    resources :form_submissions, only: [ :index, :show, :update ] do
      member do
        patch :approve
        patch :reject
        patch :star
        post  :resend_approval_email
      end
    end

    resource :email_preview, only: [ :show ]
  end

  namespace :api do
    resources :images, only: [:create]
  end

  root to: "home#index"
end
