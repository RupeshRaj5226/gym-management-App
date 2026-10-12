import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_URL = 'http://localhost:5027';

type Gender = 'Male' | 'Female' | 'Other';

type Member = {
  id: number;
  name: string;
  phone: string;
  whatsappNumber: string;
  email: string;

  dateOfBirth: string;
  age: string;

  gender: Gender | '';
  address: string;

  bloodGroup: string;
  weight: number | null;
  height: number | null;

  medicalCondition: string;
  surgeryDetails: string;

  joiningDate: string;

  status: 'Active' | 'Expired';
};

type ApiMember = {
  id: number;
  fullName: string;
  phoneNumber: string;

  whatsappNumber?: string | null;
  email?: string | null;

  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;

  bloodGroup?: string | null;
  weight?: number | null;
  height?: number | null;

  medicalCondition?: string | null;
  surgeryDetails?: string | null;

  joiningDate?: string | null;
};

// --------------------------------------------------
// CURRENT DATE
// --------------------------------------------------

const getCurrentDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// --------------------------------------------------
// DATE FORMAT
// --------------------------------------------------

const formatDate = (date?: string | null) => {
  if (!date) {
    return '-';
  }

  const value = date.substring(0, 10);

  const parts = value.split('-');

  if (parts.length !== 3) {
    return value;
  }

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

// --------------------------------------------------
// AGE CALCULATOR
// Example:
// DOB: 2004-12-12
// Today: 2026-10-08
// Result: 21 years 9 months
// --------------------------------------------------

const calculateAge = (dateOfBirth?: string | null) => {
  if (!dateOfBirth) {
    return '-';
  }

  const dob = new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) {
    return '-';
  }

  const today = new Date();

  let years =
    today.getFullYear() -
    dob.getFullYear();

  let months =
    today.getMonth() -
    dob.getMonth();

  let days =
    today.getDate() -
    dob.getDate();

  if (days < 0) {
    months--;

    const previousMonthDays = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    ).getDate();

    days += previousMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years < 0) {
    return 'Invalid DOB';
  }

  return `${years} years ${months} months`;
};

// --------------------------------------------------
// NORMALIZE DATE INPUT
// --------------------------------------------------

const makeApiDate = (date: string) => {
  const value = date.trim();

  if (!value) {
    return null;
  }

  return `${value}T00:00:00`;
};

export default function MembersScreen() {
  const [showForm, setShowForm] = useState(false);

  // ------------------------------------------------
  // FORM STATES
  // ------------------------------------------------

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] =
    useState('');
  const [email, setEmail] = useState('');

  const [dateOfBirth, setDateOfBirth] =
    useState('');

  const [gender, setGender] =
    useState<Gender | ''>('');

  const [address, setAddress] =
    useState('');

  const [bloodGroup, setBloodGroup] =
    useState('');

  const [weight, setWeight] =
    useState('');

  const [height, setHeight] =
    useState('');

  const [medicalCondition, setMedicalCondition] =
    useState('');

  const [surgeryDetails, setSurgeryDetails] =
    useState('');

  const [joiningDate, setJoiningDate] =
    useState(getCurrentDate());

  // ------------------------------------------------
  // MEMBERS
  // ------------------------------------------------

  const [members, setMembers] =
    useState<Member[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingMembers, setLoadingMembers] =
    useState(false);

  const [searchText, setSearchText] =
    useState('');

  // ------------------------------------------------
  // BLOOD GROUP
  // ------------------------------------------------

  const bloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ];

  const [showBloodGroups, setShowBloodGroups] =
    useState(false);

  // ------------------------------------------------
  // GET MEMBERS
  // ------------------------------------------------

  const loadMembers = async () => {
    try {
      setLoadingMembers(true);

      const response = await fetch(
        `${API_URL}/api/members`,
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.log(
          'GET MEMBERS ERROR:',
          response.status,
          errorText,
        );

        return;
      }

      const data = await response.json();

      console.log(
        'MEMBERS FROM API:',
        data,
      );

      const apiMembers: ApiMember[] =
        Array.isArray(data)
          ? data
          : data.members ?? [];

      const formattedMembers: Member[] =
        apiMembers.map((member) => ({
          id: member.id,

          name: member.fullName,

          phone:
            member.phoneNumber ?? '',

          whatsappNumber:
            member.whatsappNumber ?? '',

          email:
            member.email ?? '',

          dateOfBirth:
            member.dateOfBirth ?? '',

          age: calculateAge(
            member.dateOfBirth,
          ),

          gender:
            member.gender === 'Male' ||
            member.gender === 'Female' ||
            member.gender === 'Other'
              ? member.gender
              : '',

          address:
            member.address ?? '',

          bloodGroup:
            member.bloodGroup ?? '',

          weight:
            member.weight ?? null,

          height:
            member.height ?? null,

          medicalCondition:
            member.medicalCondition ?? '',

          surgeryDetails:
            member.surgeryDetails ?? '',

          joiningDate:
            member.joiningDate ?? '',

          status: 'Active',
        }));

      setMembers(formattedMembers);
    } catch (error) {
      console.log(
        'LOAD MEMBERS ERROR:',
        error,
      );

      Alert.alert(
        'Connection Error',
        'Unable to load members from server.',
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  // ------------------------------------------------
  // INITIAL LOAD
  // ------------------------------------------------

  useEffect(() => {
    loadMembers();
  }, []);

  // ------------------------------------------------
  // ANDROID BACK BUTTON
  // ------------------------------------------------

  useEffect(() => {
    const backAction = () => {
      if (showForm) {
        setShowForm(false);
        setShowBloodGroups(false);

        return true;
      }

      return false;
    };

    const subscription =
      BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

    return () => {
      subscription.remove();
    };
  }, [showForm]);

  // ------------------------------------------------
  // RESET FORM
  // ------------------------------------------------

  const resetForm = () => {
    setName('');
    setPhone('');
    setWhatsappNumber('');
    setEmail('');

    setDateOfBirth('');

    setGender('');

    setAddress('');

    setBloodGroup('');

    setWeight('');

    setHeight('');

    setMedicalCondition('');

    setSurgeryDetails('');

    // Always current date
    setJoiningDate(getCurrentDate());

    setShowBloodGroups(false);
  };

  // ------------------------------------------------
  // OPEN FORM
  // ------------------------------------------------

  const openAddForm = () => {
    setJoiningDate(getCurrentDate());

    setShowBloodGroups(false);

    setShowForm(true);
  };

  // ------------------------------------------------
  // ADD MEMBER
  // ------------------------------------------------

  const handleAddMember = async () => {
    if (!name.trim()) {
      Alert.alert(
        'Required',
        'Please enter member name.',
      );

      return;
    }

    if (!phone.trim()) {
      Alert.alert(
        'Required',
        'Please enter phone number.',
      );

      return;
    }

    if (!dateOfBirth.trim()) {
      Alert.alert(
        'Required',
        'Please enter date of birth.',
      );

      return;
    }

    // Basic DOB format check
    const dobRegex =
      /^\d{4}-\d{2}-\d{2}$/;

    if (!dobRegex.test(dateOfBirth.trim())) {
      Alert.alert(
        'Invalid Date',
        'Date of Birth must be in YYYY-MM-DD format.',
      );

      return;
    }

    const joining =
      joiningDate.trim()
        ? makeApiDate(joiningDate)
        : makeApiDate(getCurrentDate());

    try {
      setLoading(true);

      const requestBody = {
        fullName:
          name.trim(),

        phoneNumber:
          phone.trim(),

        whatsappNumber:
          whatsappNumber.trim() || null,

        email:
          email.trim() || null,

        dateOfBirth:
          makeApiDate(dateOfBirth),

        gender:
          gender || null,

        address:
          address.trim() || null,

        bloodGroup:
          bloodGroup || null,

        weight:
          weight.trim()
            ? Number(weight)
            : null,

        height:
          height.trim()
            ? Number(height)
            : null,

        medicalCondition:
          medicalCondition.trim() || null,

        surgeryDetails:
          surgeryDetails.trim() || null,

        photoUrl:
          null,

        joiningDate:
          joining,
      };

      console.log(
        'ADDING MEMBER:',
        requestBody,
      );

      const response =
        await fetch(
          `${API_URL}/api/members`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',
            },

            body:
              JSON.stringify(
                requestBody,
              ),
          },
        );

      const responseText =
        await response.text();

      console.log(
        'API STATUS:',
        response.status,
      );

      console.log(
        'API RESPONSE:',
        responseText,
      );

      let result: any = null;

      try {
        result =
          responseText
            ? JSON.parse(
                responseText,
              )
            : null;
      } catch {
        result = null;
      }

      if (!response.ok) {
        Alert.alert(
          'Unable to add member',
          result?.message ||
            responseText ||
            `Server error (${response.status})`,
        );

        return;
      }

      Alert.alert(
        'Success',
        'Member added successfully.',
      );

      resetForm();

      setShowForm(false);

      await loadMembers();
    } catch (error: any) {
      console.log(
        'ADD MEMBER ERROR:',
        error,
      );

      Alert.alert(
        'Connection Error',
        error?.message ||
          'Unable to connect to the server.',
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------
  // SEARCH
  // ------------------------------------------------

  const filteredMembers =
    members.filter((member) => {
      const search =
        searchText
          .trim()
          .toLowerCase();

      if (!search) {
        return true;
      }

      return (
        member.name
          .toLowerCase()
          .includes(search) ||
        member.phone
          .toLowerCase()
          .includes(search) ||
        member.email
          .toLowerCase()
          .includes(search)
      );
    });

  // ------------------------------------------------
  // ACTIVE MEMBERS
  // ------------------------------------------------

  const activeMembers =
    members.filter(
      (member) =>
        member.status ===
        'Active',
    ).length;

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {/* -------------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------------- */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Members
            </Text>

            <Text
              style={styles.subtitle}
            >
              Manage your gym members
            </Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() => {
              if (showForm) {
                setShowForm(false);
                setShowBloodGroups(
                  false,
                );
              } else {
                openAddForm();
              }
            }}
          >
            <Text
              style={styles.addText}
            >
              {showForm ? '×' : '+'}
            </Text>
          </Pressable>
        </View>

        {/* -------------------------------------- */}
        {/* ADD MEMBER FORM */}
        {/* -------------------------------------- */}

        {showForm && (
          <View
            style={styles.formCard}
          >
            <Text
              style={styles.formTitle}
            >
              Add New Member
            </Text>

            {/* Full Name */}

            <Text
              style={styles.label}
            >
              Full Name *
            </Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={
                setName
              }
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
            />

            {/* Phone */}

            <Text
              style={styles.label}
            >
              Phone Number *
            </Text>

            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={
                setPhone
              }
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />

            {/* WhatsApp */}

            <Text
              style={styles.label}
            >
              WhatsApp Number
            </Text>

            <TextInput
              style={styles.input}
              value={
                whatsappNumber
              }
              onChangeText={
                setWhatsappNumber
              }
              placeholder="Enter WhatsApp number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />

            {/* Email */}

            <Text
              style={styles.label}
            >
              Email
            </Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={
                setEmail
              }
              placeholder="Enter email (optional)"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* DOB */}

            <Text
              style={styles.label}
            >
              Date of Birth *
            </Text>

            <TextInput
              style={styles.input}
              value={
                dateOfBirth
              }
              onChangeText={
                setDateOfBirth
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
            />

            {dateOfBirth ? (
              <Text
                style={
                  styles.agePreview
                }
              >
                Age:{' '}
                {calculateAge(
                  dateOfBirth,
                )}
              </Text>
            ) : null}

            {/* Gender */}

            <Text
              style={styles.label}
            >
              Gender
            </Text>

            <View
              style={styles.genderRow}
            >
              {(
                [
                  'Male',
                  'Female',
                  'Other',
                ] as Gender[]
              ).map(
                (item) => {
                  const selected =
                    gender ===
                    item;

                  return (
                    <Pressable
                      key={item}
                      style={[
                        styles.genderOption,
                        selected &&
                          styles.genderOptionSelected,
                      ]}
                      onPress={() =>
                        setGender(
                          item,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.genderText,
                          selected &&
                            styles.genderTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>

            {/* Address */}

            <Text
              style={styles.label}
            >
              Address
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.addressInput,
              ]}
              value={address}
              onChangeText={
                setAddress
              }
              placeholder="Enter address"
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
            />

            {/* Blood Group */}

            <Text
              style={styles.label}
            >
              Blood Group
            </Text>

            <Pressable
              style={styles.selectInput}
              onPress={() =>
                setShowBloodGroups(
                  (value) =>
                    !value,
                )
              }
            >
              <Text
                style={
                  bloodGroup
                    ? styles.selectText
                    : styles.placeholderText
                }
              >
                {bloodGroup ||
                  'Select blood group'}
              </Text>

              <Text
                style={
                  styles.selectArrow
                }
              >
                {showBloodGroups
                  ? '▲'
                  : '▼'}
              </Text>
            </Pressable>

            {showBloodGroups && (
              <View
                style={
                  styles.optionsContainer
                }
              >
                {bloodGroups.map(
                  (group) => {
                    const selected =
                      bloodGroup ===
                      group;

                    return (
                      <Pressable
                        key={group}
                        style={[
                          styles.bloodOption,
                          selected &&
                            styles.bloodOptionSelected,
                        ]}
                        onPress={() => {
                          setBloodGroup(
                            group,
                          );

                          setShowBloodGroups(
                            false,
                          );
                        }}
                      >
                        <Text
                          style={[
                            styles.bloodOptionText,
                            selected &&
                              styles.bloodOptionTextSelected,
                          ]}
                        >
                          {group}
                        </Text>
                      </Pressable>
                    );
                  },
                )}
              </View>
            )}

            {/* Weight */}

            <Text
              style={styles.label}
            >
              Weight (kg)
            </Text>

            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={
                setWeight
              }
              placeholder="Example: 70"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
            />

            {/* Height */}

            <Text
              style={styles.label}
            >
              Height (cm)
            </Text>

            <TextInput
              style={styles.input}
              value={height}
              onChangeText={
                setHeight
              }
              placeholder="Example: 175"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
            />

            {/* Medical */}

            <Text
              style={styles.label}
            >
              Medical Condition
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
              ]}
              value={
                medicalCondition
              }
              onChangeText={
                setMedicalCondition
              }
              placeholder="Any medical condition"
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
            />

            {/* Surgery */}

            <Text
              style={styles.label}
            >
              Surgery Details
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
              ]}
              value={
                surgeryDetails
              }
              onChangeText={
                setSurgeryDetails
              }
              placeholder="Previous surgery details"
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
            />

            {/* Joining Date */}

            <Text
              style={styles.label}
            >
              Joining Date
            </Text>

            <TextInput
              style={styles.input}
              value={
                joiningDate
              }
              onChangeText={
                setJoiningDate
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
            />

            <Text
              style={
                styles.helperText
              }
            >
              Current date is filled
              automatically. You can
              change it if needed.
            </Text>

            {/* Save */}

            <Pressable
              style={[
                styles.saveButton,
                loading &&
                  styles.disabledButton,
              ]}
              onPress={
                handleAddMember
              }
              disabled={loading}
            >
              {loading ? (
                <View
                  style={
                    styles.loadingRow
                  }
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
                  style={
                    styles.saveButtonText
                  }
                >
                  Add Member
                </Text>
              )}
            </Pressable>
          </View>
        )}

        {/* -------------------------------------- */}
        {/* SEARCH */}
        {/* -------------------------------------- */}

        <View
          style={styles.searchBox}
        >
          <Text
            style={styles.searchIcon}
          >
            ⌕
          </Text>

          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={
              setSearchText
            }
            placeholder="Search members..."
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* -------------------------------------- */}
        {/* SUMMARY */}
        {/* -------------------------------------- */}

        <View
          style={styles.summaryCard}
        >
          <View>
            <Text
              style={
                styles.summaryLabel
              }
            >
              Total Members
            </Text>

            <Text
              style={
                styles.summaryValue
              }
            >
              {members.length}
            </Text>
          </View>

          <View
            style={
              styles.activeBadge
            }
          >
            <Text
              style={
                styles.activeBadgeText
              }
            >
              {activeMembers}{' '}
              Active
            </Text>
          </View>
        </View>

        {/* -------------------------------------- */}
        {/* LOADING */}
        {/* -------------------------------------- */}

        {loadingMembers ? (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="large"
              color="#2563EB"
            />

            <Text
              style={
                styles.loadingMembersText
              }
            >
              Loading members...
            </Text>
          </View>
        ) : null}

        {/* -------------------------------------- */}
        {/* MEMBER LIST */}
        {/* -------------------------------------- */}

        {!loadingMembers &&
        filteredMembers.length >
          0 ? (
          <View>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Member List
            </Text>

            {filteredMembers.map(
              (member) => (
                <View
                  key={member.id}
                  style={
                    styles.memberCard
                  }
                >
                  {/* Avatar */}

                  <View
                    style={
                      styles.memberAvatar
                    }
                  >
                    <Text
                      style={
                        styles.memberAvatarText
                      }
                    >
                      {member.name
                        .charAt(
                          0,
                        )
                        .toUpperCase()}
                    </Text>
                  </View>

                  {/* Main Info */}

                  <View
                    style={
                      styles.memberInfo
                    }
                  >
                    <View
                      style={
                        styles.memberTopRow
                      }
                    >
                      <Text
                        style={
                          styles.memberName
                        }
                      >
                        {member.name}
                      </Text>

                      <View
                        style={
                          styles.statusBadge
                        }
                      >
                        <Text
                          style={
                            styles.statusText
                          }
                        >
                          {
                            member.status
                          }
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={
                        styles.memberPhone
                      }
                    >
                      📞{' '}
                      {member.phone}
                    </Text>

                    {member.email ? (
                      <Text
                        style={
                          styles.memberEmail
                        }
                      >
                        ✉{' '}
                        {
                          member.email
                        }
                      </Text>
                    ) : null}

                    {/* Details */}

                    <View
                      style={
                        styles.detailsBox
                      }
                    >
                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        DOB:{' '}
                        {formatDate(
                          member.dateOfBirth,
                        )}
                      </Text>

                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        Age:{' '}
                        {member.age}
                      </Text>

                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        Gender:{' '}
                        {member.gender ||
                          '-'}
                      </Text>

                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        Blood:{' '}
                        {member.bloodGroup ||
                          '-'}
                      </Text>

                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        Weight:{' '}
                        {member.weight !=
                        null
                          ? `${member.weight} kg`
                          : '-'}
                      </Text>

                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        Height:{' '}
                        {member.height !=
                        null
                          ? `${member.height} cm`
                          : '-'}
                      </Text>

                      <Text
                        style={
                          styles.detailText
                        }
                      >
                        Joining:{' '}
                        {formatDate(
                          member.joiningDate,
                        )}
                      </Text>
                    </View>

                    {member.address ? (
                      <Text
                        style={
                          styles.extraDetail
                        }
                      >
                        Address:{' '}
                        {
                          member.address
                        }
                      </Text>
                    ) : null}

                    {member
                      .medicalCondition ? (
                      <Text
                        style={
                          styles.extraDetail
                        }
                      >
                        Medical:{' '}
                        {
                          member.medicalCondition
                        }
                      </Text>
                    ) : null}

                    {member
                      .surgeryDetails ? (
                      <Text
                        style={
                          styles.extraDetail
                        }
                      >
                        Surgery:{' '}
                        {
                          member.surgeryDetails
                        }
                      </Text>
                    ) : null}
                  </View>
                </View>
              ),
            )}
          </View>
        ) : !loadingMembers ? (
          /* -------------------------------------- */
          /* EMPTY */
          /* -------------------------------------- */

          <View
            style={styles.emptyCard}
          >
            <View
              style={
                styles.emptyIconContainer
              }
            >
              <Text
                style={
                  styles.emptyIcon
                }
              >
                👥
              </Text>
            </View>

            <Text
              style={
                styles.emptyTitle
              }
            >
              {searchText
                ? 'No members found'
                : 'No members yet'}
            </Text>

            <Text
              style={
                styles.emptySubtitle
              }
            >
              {searchText
                ? 'Try another name, phone number or email.'
                : 'Add your first gym member to start managing memberships.'}
            </Text>

            {!searchText ? (
              <Pressable
                style={
                  styles.addMemberButton
                }
                onPress={
                  openAddForm
                }
              >
                <Text
                  style={
                    styles.addMemberButtonText
                  }
                >
                  + Add Member
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
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
    justifyContent:
      'center',
  },

  addText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginBottom: 16,
  },

  formTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 14,
    marginBottom: 7,
  },

  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    fontSize: 15,
  },

  addressInput: {
    height: 80,
    paddingTop: 13,
  },

  textArea: {
    height: 80,
    paddingTop: 13,
  },

  agePreview: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 7,
  },

  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },

  genderOption: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent:
      'center',
    backgroundColor: '#FFFFFF',
  },

  genderOptionSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  genderText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },

  genderTextSelected: {
    color: '#FFFFFF',
  },

  selectInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  selectText: {
    color: '#0F172A',
    fontSize: 15,
  },

  placeholderText: {
    color: '#94A3B8',
    fontSize: 15,
  },

  selectArrow: {
    color: '#64748B',
    fontSize: 12,
  },

  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    marginTop: 6,
    padding: 8,
  },

  bloodOption: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 9,
  },

  bloodOptionSelected: {
    backgroundColor: '#EFF6FF',
  },

  bloodOptionText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },

  bloodOptionTextSelected: {
    color: '#2563EB',
  },

  helperText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
  },

  saveButton: {
    height: 48,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent:
      'center',
    marginTop: 20,
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

  searchBox: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  searchIcon: {
    fontSize: 24,
    color: '#64748B',
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 5,
  },

  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  activeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  activeBadgeText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  memberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent:
      'center',
  },

  memberAvatarText: {
    color: '#2563EB',
    fontSize: 19,
    fontWeight: '800',
  },

  memberInfo: {
    flex: 1,
    marginLeft: 13,
  },

  memberTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    marginBottom: 4,
  },

  memberName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },

  memberPhone: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },

  memberEmail: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '700',
  },

  detailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    gap: 5,
  },

  detailText: {
    color: '#475569',
    fontSize: 11,
  },

  extraDetail: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 6,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 30,
    alignItems: 'center',
    marginTop: 4,
  },

  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent:
      'center',
    marginBottom: 16,
  },

  emptyIcon: {
    fontSize: 32,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 7,
  },

  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  addMemberButton: {
    marginTop: 22,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  addMemberButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  loadingMembersText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 10,
  },
});
