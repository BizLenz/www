{
  description = "BizLenz/www";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
  };

  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {inherit system;};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [
        bun
        nodejs
        postgresql
      ];

      shellHook = ''
        export PGDATA="$PWD/.pg/data"
        export PGHOST="$PWD/.pg"
        export PGDATABASE="bizlenz"

        if [ ! -d "$PGDATA" ]; then
          echo "Initializing local PostgreSQL..."
          initdb --no-locale --encoding=UTF-8 -U "$USER"
          echo "unix_socket_directories = '$PWD/.pg'" >> "$PGDATA/postgresql.conf"
          echo "listen_addresses = '''" >> "$PGDATA/postgresql.conf"
          pg_ctl start -l "$PWD/.pg/postgresql.log"
          createdb -U "$USER" bizlenz
          echo "PostgreSQL initialized and running."
        else
          pg_ctl status > /dev/null 2>&1 || pg_ctl start -l "$PWD/.pg/postgresql.log"
        fi
      '';
    };
  };
}
