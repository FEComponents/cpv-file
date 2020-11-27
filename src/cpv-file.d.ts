import Vue, {VueConstructor} from 'vue'

/**
 * @FYI https://www.yuque.com/docs/share/a72a1b84-c0e4-4bd5-853f-6711cb08a507
 */
declare module '@fe-components/cpv-file' {
  class VueComponent extends Vue {
    static install(vue: typeof Vue): void
  }

  type CombinedVueInstance<
    Instance extends Vue,
    Data,
    Methods,
    Computed,
    Props
  > = Data & Methods & Computed & Props & Instance

  type ExtendedVue<
    Instance extends Vue,
    Data,
    Methods,
    Computed,
    Props
  > = VueConstructor<
    CombinedVueInstance<Instance, Data, Methods, Computed, Props> & Vue
  >

  type Combined<Data, Methods, Computed, Props> = Data &
    Methods &
    Computed &
    Props

  type CpvFileData = {}

  type CpvFileMethods = {}

  type CpvFileComputed = {}

  type CpvFileProps = {}

  type CpvFile = Combined<
    CpvFileData,
    CpvFileMethods,
    CpvFileComputed,
    CpvFileProps
  >

  export interface CpvFileType extends VueComponent, CpvFile {}

  const CpvFileConstruction: ExtendedVue<
    Vue,
    CpvFileData,
    CpvFileMethods,
    CpvFileComputed,
    CpvFileProps
  >

  export default CpvFileConstruction
}
