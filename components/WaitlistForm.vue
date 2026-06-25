<script setup>
import { ref, computed } from 'vue'
import { CheckCircle2, Loader2 } from 'lucide-vue-next'

const { t } = useI18n()
const { submitWaitlist } = useWaitlist()

const firstName = ref('')
const lastName  = ref('')
const email     = ref('')
const interest  = ref('')

const status  = ref('idle') // idle | loading | success | error
const errorMsg = ref('')

const interestKeys = ['scopri', 'leggi', 'scambio', 'community', 'tutto']
const interestOptions = computed(() => interestKeys.map((key) => ({
  value: key,
  label: t(`waitlist.form.interestOptions.${key}`),
})))

// Built from two plain strings (not one message containing "@") because
// vue-i18n's message compiler treats "@" as the start of a linked-message
// token, even when escaped — so it can never appear literally in a translated string.
const emailPlaceholder = computed(
  () => `${t('waitlist.form.placeholderEmailUser')}@${t('waitlist.form.placeholderEmailDomain')}`
)

async function handleSubmit() {
  if (status.value === 'loading') return
  status.value = 'loading'
  errorMsg.value = ''

  try {
    await submitWaitlist({
      firstName: firstName.value.trim(),
      lastName:  lastName.value.trim(),
      email:     email.value.trim(),
      interest:  interest.value,
    })
    status.value = 'success'
  } catch (err) {
    status.value = 'error'
    errorMsg.value = err?.message ?? t('waitlist.form.errorGeneric')
  }
}
</script>

<template>
  <div class="bg-white border border-ink/10 rounded-3xl p-6 sm:p-8 shadow-xl shadow-ink/5">
    <template v-if="status === 'success'">
      <div class="flex flex-col items-center text-center py-6">
        <CheckCircle2 :size="40" :stroke-width="1.5" class="text-terra mb-3" />
        <p class="font-semibold text-ink text-xl">{{ $t('waitlist.form.successTitle') }}</p>
        <p class="text-ink/50 text-base mt-2">
          {{ $t('waitlist.form.successText') }}
        </p>
      </div>
    </template>

    <template v-else>
      <h3 class="font-semibold text-ink text-xl mb-2">{{ $t('waitlist.form.title') }}</h3>
      <p class="text-ink/50 text-base leading-relaxed mb-6">
        {{ $t('waitlist.form.description') }}
      </p>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-ink/60 mb-2">
            {{ $t('waitlist.form.labelFirstName') }}<span class="text-terra">*</span>
          </label>
          <input
            v-model="firstName"
            type="text"
            required
            :placeholder="$t('waitlist.form.placeholderFirstName')"
            class="w-full bg-cream border border-ink/12 rounded-xl px-4 py-3 text-base text-ink placeholder-ink/30 focus:outline-none focus:border-terra transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-ink/60 mb-2">
            {{ $t('waitlist.form.labelLastName') }}<span class="text-terra">*</span>
          </label>
          <input
            v-model="lastName"
            type="text"
            required
            :placeholder="$t('waitlist.form.placeholderLastName')"
            class="w-full bg-cream border border-ink/12 rounded-xl px-4 py-3 text-base text-ink placeholder-ink/30 focus:outline-none focus:border-terra transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-ink/60 mb-2">
            {{ $t('waitlist.form.labelEmail') }}<span class="text-terra">*</span>
          </label>
          <input
            v-model="email"
            type="email"
            required
            :placeholder="emailPlaceholder"
            class="w-full bg-cream border border-ink/12 rounded-xl px-4 py-3 text-base text-ink placeholder-ink/30 focus:outline-none focus:border-terra transition-colors"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-ink/60 mb-2">
            {{ $t('waitlist.form.labelInterest') }}<span class="text-terra">*</span>
          </label>
          <select
            v-model="interest"
            required
            class="w-full bg-cream border border-ink/12 rounded-xl px-4 py-3 text-base text-ink focus:outline-none focus:border-terra transition-colors appearance-none"
          >
            <option value="" disabled>{{ $t('waitlist.form.placeholderInterest') }}</option>
            <option v-for="opt in interestOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <p v-if="status === 'error'" class="text-terra text-sm">{{ errorMsg }}</p>

        <button
          type="submit"
          :disabled="status === 'loading'"
          class="w-full bg-terra hover:bg-terra/90 disabled:opacity-50 text-white text-base font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
        >
          <Loader2 v-if="status === 'loading'" :size="16" :stroke-width="2" class="animate-spin" />
          {{ status === 'loading' ? $t('waitlist.form.submitting') : $t('waitlist.form.submit') }}
        </button>
      </form>
    </template>
  </div>
</template>
