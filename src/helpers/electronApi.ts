import remote from "@electron/remote"

export default function electronApi(): typeof remote {
  // @ts-ignore
  return {...window.electron } as typeof remote
}
