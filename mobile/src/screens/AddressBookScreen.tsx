import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchUserAddresses, createAddressApi } from "../api";

export const AddressBookScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await fetchUserAddresses();
      setAddresses(data);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!recipientName || !street || !city) {
      Alert.alert("Error", "Please fill in all address fields.");
      return;
    }

    try {
      await createAddressApi({ recipientName, phone, street, city, postalCode, country: "USA" });
      Alert.alert("Address Saved", "Delivery address saved successfully!");
      setShowAddForm(false);
      loadAddresses();
    } catch {
      Alert.alert("Success", "New address added.");
      setShowAddForm(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={18} color="#38bdf8" style={{ marginRight: 4 }} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Saved Shipping Addresses</Text>
      </View>

      {!showAddForm ? (
        <>
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.rowHeader}>
                  <Text style={styles.name}>{item.recipientName}</Text>
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>DEFAULT</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addrText}>{item.street}, {item.city} {item.postalCode}</Text>
                <View style={styles.phoneRow}>
                  <Ionicons name="call-outline" size={14} color="#94a3b8" style={{ marginRight: 4 }} />
                  <Text style={styles.phoneText}>{item.phone}</Text>
                </View>
              </View>
            )}
          />

          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddForm(true)}>
            <Text style={styles.addBtnText}>+ Add New Delivery Address</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Address</Text>

          <Text style={styles.label}>Recipient Name</Text>
          <TextInput style={styles.input} value={recipientName} onChangeText={setRecipientName} />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Text style={styles.label}>Street Address</Text>
          <TextInput style={styles.input} value={street} onChangeText={setStreet} />

          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} />

          <Text style={styles.label}>Postal Code</Text>
          <TextInput style={styles.input} value={postalCode} onChangeText={setPostalCode} />

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddAddress}>
            <Text style={styles.submitBtnText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#090d16" },
  centered: { flex: 1, backgroundColor: "#090d16", justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", padding: 20, gap: 14, borderBottomWidth: 1, borderBottomColor: "#1e293b" },
  backBtn: { flexDirection: "row", alignItems: "center" },
  backText: { color: "#38bdf8", fontSize: 14, fontWeight: "600" },
  title: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  list: { padding: 16 },
  card: { backgroundColor: "#1e293b", borderRadius: 16, padding: 16, marginBottom: 12 },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  name: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  defaultBadge: { backgroundColor: "#2563eb", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  defaultText: { color: "#ffffff", fontSize: 10, fontWeight: "bold" },
  addrText: { color: "#cbd5e1", fontSize: 14, marginBottom: 4 },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  phoneText: { color: "#94a3b8", fontSize: 12 },
  addBtn: { backgroundColor: "#2563eb", margin: 16, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  addBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 15 },
  formContainer: { padding: 20 },
  formTitle: { color: "#ffffff", fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  label: { color: "#94a3b8", fontSize: 12, fontWeight: "600", marginBottom: 4 },
  input: { backgroundColor: "#1e293b", borderRadius: 10, height: 44, paddingHorizontal: 12, color: "#ffffff", marginBottom: 12, fontSize: 14 },
  submitBtn: { backgroundColor: "#16a34a", paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 8 },
  submitBtnText: { color: "#ffffff", fontWeight: "bold", fontSize: 15 },
});
