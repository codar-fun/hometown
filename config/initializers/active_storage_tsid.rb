ActiveSupport.on_load(:active_storage_blob)             { include HasTsid }
ActiveSupport.on_load(:active_storage_attachment)       { include HasTsid }
ActiveSupport.on_load(:active_storage_variant_record)   { include HasTsid }
