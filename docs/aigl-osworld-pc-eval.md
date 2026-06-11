# AIGL OSWorld PC Evaluation

OSWorld is the external benchmark for AIGL's PC operation layer. It should be used to improve desktop observation, GUI input, recovery, and task execution stability before broader platform migration.

## Current Local Status

The OSWorld source is expected at:

```text
F:\AIGril\build-cache\OSWorld
```

Run the local readiness probe:

```bash
pnpm bench:osworld:readiness
```

The report is written to:

```text
eval-results/engineering/osworld-pc-readiness/osworld-pc-readiness.report.json
eval-results/engineering/osworld-pc-readiness/osworld-pc-readiness.report.md
```

## Official OSWorld Requirements

Official OSWorld runs need one desktop VM provider:

- VMware Workstation Pro with `vmrun`
- VirtualBox with `VBoxManage`
- Docker/KVM on Linux or a suitable Docker Desktop backend
- Cloud providers such as AWS for parallel verified runs

Without a provider, AIGL can still run readiness checks and local PC-tool smoke tests, but it cannot complete official OSWorld trajectories.

## Current Working Route

On this machine, Windows native VMware/VirtualBox/Docker is not available, but WSL Ubuntu 22.04 has Docker and `/dev/kvm`.

Use the WSL route:

```bash
bash /mnt/f/AIGril/scripts/setup-osworld-wsl.sh full
```

Then run the official OSWorld quickstart:

```bash
pnpm bench:osworld:quickstart:wsl
```

The OSWorld Docker VM image is large. Store it on the WSL filesystem, not `F:`, because `F:` may not have enough free space:

```bash
mkdir -p /root/osworld-docker-vm-data
cd /mnt/f/AIGril/build-cache/OSWorld
rm -rf docker_vm_data
ln -s /root/osworld-docker-vm-data docker_vm_data
```

If Docker Hub times out while pulling the OSWorld container image, use a mirror and tag it back to the name expected by OSWorld:

```bash
docker pull docker.1ms.run/happysixd/osworld-docker:latest
docker tag docker.1ms.run/happysixd/osworld-docker:latest happysixd/osworld-docker:latest
```

## AIGL PC Capability Contract

The `computer` tool now exposes OSWorld-style PC primitives:

- `screen_screenshot`
- `mouse_move`
- `mouse_click`
- `mouse_double_click`
- `mouse_right_click`
- `mouse_drag`
- `scroll`
- `keyboard_type`
- `keyboard_press`
- `keyboard_hotkey`
- `clipboard_read`
- `clipboard_write`
- `wait`

These sit beside the existing filesystem, process, PTY, watch, rollback, and command actions.

## Evaluation Flow

1. Run `pnpm bench:osworld:readiness`.
2. Install or connect one official OSWorld provider.
3. Run OSWorld `quickstart.py` with that provider.
4. Add an AIGL OSWorld agent wrapper that maps OSWorld observations into AIGL vision context and maps AIGL PC actions into OSWorld actions.
5. Start with `evaluation_examples/test_small.json`.
6. Use trajectory failures to tune AIGL's computer tool, evidence ledger, recovery loop, and persona surface.
