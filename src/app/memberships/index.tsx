import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_URL = 'http://localhost:5027';

type Member = {
  id: number;
  fullName: string;
  phoneNumber: string;
};

type Plan = {
  name: string;
  duration: number;
  price: number;
  color: string;
};

const plans: Plan[] = [
  {
    name: 'Monthly',
    duration: 1,
    price: 999,
    color: '#2563EB',
  },
  {
    name: 'Quarterly',
    duration: 3,
    price: 2499,
    color: '#7C3AED',
  },
  {
    name: 'Half Yearly',
    duration: 6,
    price: 4499,
    color: '#059669',
  },
  {
    name: 'Yearly',
    duration: 12,
    price: 7999,
    color: '#EA580C',
  },
];

const paymentModes = ['Cash', 'UPI', 'Card', 'Bank Transfer'];

export default function MembershipsScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] =
    useState<number | null>(null);

  const [selectedPlan, setSelectedPlan] =
    useState<Plan | null>(null);

  const [amount, setAmount] = useState('');

  const [paymentMode, setPaymentMode] =
    useState('Cash');

  const [startDate, setStartDate] =
    useState('');

  const [showForm, setShowForm] = useState(false);
  const [showMembers, setShowMembers] =
    useState(false);
  const [showPaymentModes, setShowPaymentModes] =
    useState(false);

  const [loadingMembers, setLoadingMembers] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [activeMemberships, setActiveMemberships] =
    useState(0);

  // ------------------------------------------
  // LOAD MEMBERS
  // ------------------------------------------

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);

      const response = await fetch(
        `${API_URL}/api/members`,
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.log(
          'GET MEMBERS ERROR:',
          errorText,
        );

        return;
      }

      const data = await response.json();

      const apiMembers: Member[] =
        Array.isArray(data)
          ? data
          : data.members ?? [];

      setMembers(apiMembers);
    } catch (error) {
      console.log(
        'LOAD MEMBERS ERROR:',
        error,
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // ------------------------------------------
  // OPEN FORM
  // ------------------------------------------

  const openMembershipForm = () => {
    setShowForm(true);

    setSelectedMemberId(null);
    setSelectedPlan(null);
    setAmount('');
    setPaymentMode('Cash');

    const today = new Date();

    const formattedDate =
      today.getFullYear() +
      '-' +
      String(today.getMonth() + 1).padStart(
        2,
        '0',
      ) +
      '-' +
      String(today.getDate()).padStart(2, '0');

    setStartDate(formattedDate);
  };

  // ------------------------------------------
  // SELECT PLAN
  // ------------------------------------------

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setAmount(plan.price.toString());
  };

  // ------------------------------------------
  // CREATE MEMBERSHIP
  // ------------------------------------------

  const handleCreateMembership = async () => {
    if (!selectedMemberId) {
      Alert.alert(
        'Required',
        'Please select a member.',
      );
      return;
    }

    if (!selectedPlan) {
      Alert.alert(
        'Required',
        'Please select a membership plan.',
      );
      return;
    }

    if (!amount.trim()) {
      Alert.alert(
        'Required',
        'Please enter amount.',
      );
      return;
    }

    const amountValue = Number(amount);

    if (
      Number.isNaN(amountValue) ||
      amountValue < 0
    ) {
      Alert.alert(
        'Invalid Amount',
        'Please enter a valid amount.',
      );
      return;
    }

    if (!startDate.trim()) {
      Alert.alert(
        'Required',
        'Please enter start date.',
      );
      return;
    }

    try {
      setSaving(true);

      const requestBody = {
        memberId: selectedMemberId,

        durationInMonths:
          selectedPlan.duration,

        startDate: `${startDate}T00:00:00`,

        amountPaid: amountValue,

        paymentMode: paymentMode,
      };

      console.log(
        'CREATE MEMBERSHIP:',
        requestBody,
      );

      const response = await fetch(
        `${API_URL}/api/memberships`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      const responseText =
        await response.text();

      console.log(
        'MEMBERSHIP STATUS:',
        response.status,
      );

      console.log(
        'MEMBERSHIP RESPONSE:',
        responseText,
      );

      let result: any = null;

      try {
        result = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        Alert.alert(
          'Unable to create membership',
          result?.message ||
            responseText ||
            `Server error (${response.status})`,
        );

        return;
      }

      Alert.alert(
        'Success',
        result?.message ||
          'Membership created successfully.',
      );

      setActiveMemberships(
        (current) => current + 1,
      );

      setShowForm(false);
      setSelectedMemberId(null);
      setSelectedPlan(null);
      setAmount('');
      setPaymentMode('Cash');
    } catch (error: any) {
      console.log(
        'CREATE MEMBERSHIP ERROR:',
        error,
      );

      Alert.alert(
        'Connection Error',
        error?.message ||
          'Unable to connect to the server.',
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedMember = members.find(
    (member) =>
      member.id === selectedMemberId,
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Memberships
          </Text>

          <Text style={styles.subtitle}>
            Manage gym memberships
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => {
            if (showForm) {
              setShowForm(false);
            } else {
              openMembershipForm();
            }
          }}
        >
          <Text style={styles.addText}>
            {showForm ? '×' : '+'}
          </Text>
        </Pressable>
      </View>

      {/* Overview */}
      <View style={styles.overviewCard}>
        <View>
          <Text style={styles.overviewLabel}>
            Active Memberships
          </Text>

          <Text style={styles.overviewValue}>
            {activeMemberships}
          </Text>
        </View>

        <View style={styles.membershipIcon}>
          <Text style={styles.membershipIconText}>
            ★
          </Text>
        </View>
      </View>

      {/* Create Membership Form */}
      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            Create Membership
          </Text>

          {/* Member */}
          <Text style={styles.label}>
            Select Member
          </Text>

          <Pressable
            style={styles.selectBox}
            onPress={() =>
              setShowMembers(
                (value) => !value,
              )
            }
          >
            <Text
              style={
                selectedMember
                  ? styles.selectText
                  : styles.placeholderText
              }
            >
              {selectedMember
                ? `${selectedMember.fullName} - ${selectedMember.phoneNumber}`
                : 'Select a member'}
            </Text>

            <Text style={styles.chevron}>
              {showMembers ? '▲' : '▼'}
            </Text>
          </Pressable>

          {showMembers && (
            <View style={styles.dropdown}>
              {loadingMembers ? (
                <ActivityIndicator
                  color="#2563EB"
                />
              ) : members.length === 0 ? (
                <Text
                  style={
                    styles.noMemberText
                  }
                >
                  No members found.
                </Text>
              ) : (
                members.map((member) => (
                  <Pressable
                    key={member.id}
                    style={styles.memberOption}
                    onPress={() => {
                      setSelectedMemberId(
                        member.id,
                      );

                      setShowMembers(false);
                    }}
                  >
                    <Text
                      style={
                        styles.memberOptionName
                      }
                    >
                      {member.fullName}
                    </Text>

                    <Text
                      style={
                        styles.memberOptionPhone
                      }
                    >
                      {member.phoneNumber}
                    </Text>
                  </Pressable>
                ))
              )}
            </View>
          )}

          {/* Plans */}
          <Text style={styles.label}>
            Membership Plan
          </Text>

          {plans.map((plan) => {
            const selected =
              selectedPlan?.duration ===
              plan.duration;

            return (
              <Pressable
                key={plan.name}
                style={[
                  styles.planSelectCard,
                  selected &&
                    styles.selectedPlanCard,
                  {
                    borderColor: selected
                      ? plan.color
                      : '#E2E8F0',
                  },
                ]}
                onPress={() =>
                  handlePlanSelect(plan)
                }
              >
                <View
                  style={[
                    styles.planIcon,
                    {
                      backgroundColor: `${plan.color}18`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.planIconText,
                      {
                        color: plan.color,
                      },
                    ]}
                  >
                    ★
                  </Text>
                </View>

                <View
                  style={styles.planContent}
                >
                  <Text
                    style={styles.planName}
                  >
                    {plan.name}
                  </Text>

                  <Text
                    style={styles.planDuration}
                  >
                    {plan.duration} Month
                    {plan.duration > 1
                      ? 's'
                      : ''}
                  </Text>
                </View>

                <Text
                  style={styles.planPrice}
                >
                  ₹
                  {plan.price.toLocaleString(
                    'en-IN',
                  )}
                </Text>
              </Pressable>
            );
          })}

          {/* Start Date */}
          <Text style={styles.label}>
            Start Date
          </Text>

          <TextInput
            style={styles.input}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94A3B8"
          />

          {/* Amount */}
          <Text style={styles.label}>
            Amount Paid
          </Text>

          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
          />

          {/* Payment Mode */}
          <Text style={styles.label}>
            Payment Mode
          </Text>

          <Pressable
            style={styles.selectBox}
            onPress={() =>
              setShowPaymentModes(
                (value) => !value,
              )
            }
          >
            <Text style={styles.selectText}>
              {paymentMode}
            </Text>

            <Text style={styles.chevron}>
              {showPaymentModes
                ? '▲'
                : '▼'}
            </Text>
          </Pressable>

          {showPaymentModes && (
            <View style={styles.dropdown}>
              {paymentModes.map((mode) => (
                <Pressable
                  key={mode}
                  style={styles.memberOption}
                  onPress={() => {
                    setPaymentMode(mode);

                    setShowPaymentModes(
                      false,
                    );
                  }}
                >
                  <Text
                    style={
                      styles.memberOptionName
                    }
                  >
                    {mode}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Save */}
          <Pressable
            style={[
              styles.saveButton,
              saving &&
                styles.disabledButton,
            ]}
            onPress={
              handleCreateMembership
            }
            disabled={saving}
          >
            {saving ? (
              <View
                style={styles.loadingRow}
              >
                <ActivityIndicator
                  color="#FFFFFF"
                  size="small"
                />

                <Text
                  style={[
                    styles.saveButtonText,
                    styles.loadingText,
                  ]}
                >
                  Saving...
                </Text>
              </View>
            ) : (
              <Text
                style={styles.saveButtonText}
              >
                Create Membership
              </Text>
            )}
          </Pressable>
        </View>
      )}

      {/* Plans */}
      <Text style={styles.sectionTitle}>
        Membership Plans
      </Text>

      {plans.map((plan) => (
        <View
          key={plan.name}
          style={styles.planCard}
        >
          <View
            style={[
              styles.planIcon,
              {
                backgroundColor: `${plan.color}18`,
              },
            ]}
          >
            <Text
              style={[
                styles.planIconText,
                {
                  color: plan.color,
                },
              ]}
            >
              ★
            </Text>
          </View>

          <View style={styles.planContent}>
            <Text style={styles.planName}>
              {plan.name}
            </Text>

            <Text style={styles.planDuration}>
              {plan.duration} Month
              {plan.duration > 1
                ? 's'
                : ''}
            </Text>
          </View>

          <Text style={styles.planPrice}>
            ₹
            {plan.price.toLocaleString(
              'en-IN',
            )}
          </Text>
        </View>
      ))}

      {/* Expiring */}
      <Text style={styles.sectionTitle}>
        Expiring Memberships
      </Text>

      <View style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>
          ⏰
        </Text>

        <Text style={styles.emptyTitle}>
          No memberships expiring
        </Text>

        <Text style={styles.emptySubtitle}>
          Members whose memberships are
          about to expire will appear here.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
  },

  overviewCard: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },

  overviewLabel: {
    color: '#DBEAFE',
    fontSize: 14,
    marginBottom: 6,
  },

  overviewValue: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
  },

  membershipIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor:
      'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  membershipIconText: {
    color: '#FFFFFF',
    fontSize: 25,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 24,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 16,
    marginBottom: 7,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    fontSize: 15,
  },

  selectBox: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectText: {
    color: '#0F172A',
    fontSize: 14,
    flex: 1,
  },

  placeholderText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  chevron: {
    color: '#64748B',
    fontSize: 12,
    marginLeft: 10,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
    overflow: 'hidden',
  },

  memberOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  memberOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },

  memberOptionPhone: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  noMemberText: {
    padding: 14,
    color: '#64748B',
    fontSize: 13,
  },

  planSelectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  selectedPlanCard: {
    backgroundColor: '#F8FAFF',
  },

  planIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  planIconText: {
    fontSize: 18,
  },

  planContent: {
    flex: 1,
    marginLeft: 12,
  },

  planName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  planDuration: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  planPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },

  saveButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  disabledButton: {
    opacity: 0.7,
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  loadingText: {
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 28,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 30,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
