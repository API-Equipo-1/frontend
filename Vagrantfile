Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/focal64"

  config.vm.network "forwarded_port", guest: 8080, host: 8080  # Backend
  config.vm.network "forwarded_port", guest: 80, host: 3000    # Frontend

  config.vm.provider "virtualbox" do |vb|
    vb.name = "fullstack-app"
    vb.memory = 4096
    vb.cpus = 2
  end

  # Provision: instalar Docker y docker-compose
  config.vm.provision "shell", inline: <<-SHELL
    apt-get update -y
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository \
      "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable"

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io

    # Instalar docker-compose standalone
    curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    usermod -aG docker vagrant
  SHELL

  # Levanta containers automáticamente al iniciar
  config.vm.provision "shell", inline: <<-SHELL
    cd /vagrant
    docker-compose up -d --build
  SHELL
end
