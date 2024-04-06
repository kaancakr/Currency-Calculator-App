import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface Rates {
  [key: string]: number;
}

const HomeScreen: React.FC = () => {
  const [rates, setRates] = useState<Rates | undefined>();
  const [ratesFetched, setRatesFetched] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [output, setOutput] = useState<string | undefined>();
  const [selectFromCurrencyModalVisible, setSelectFromCurrencyModalVisible] =
    useState<boolean>(false);
  const [selectToCurrencyModalVisible, setSelectToCurrencyModalVisible] =
    useState<boolean>(false);

  const getRates = async () => {
    try {
      const response = await fetch(
        "https://v6.exchangerate-api.com/v6/0e1b368d3bda2bce20e3ee71/latest/USD"
      );
      const data = await response.json();
      if (data.result === "success") {
        setRates(data.conversion_rates);
        setRatesFetched(true);
      }
    } catch (error) {
      console.error("Error fetching rates: ", error);
    }
  };

  useEffect(() => {
    getRates();
  }, []);

  const handleOpenFromCurrencyModal = () => {
    setSelectFromCurrencyModalVisible(true);
  };

  const handleOpenToCurrencyModal = () => {
    setSelectToCurrencyModalVisible(true);
  };

  const calculateOutput = () => {
    if (!rates) return;

    const CurrencyRate = rates[toCurrency];
    const outputValue = parseFloat(amount) * CurrencyRate;
    setOutput(outputValue.toFixed(2));
  };

  const handleConfirmFromCurrency = (currency: string) => {
    setFromCurrency(currency);
    calculateOutput();
  };

  const handleConfirmToCurrency = (currency: string) => {
    setToCurrency(currency);
    calculateOutput();
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0F0F0F",
        width: wp(100),
      }}
    >
      <View style={styles.headingContainer}>
        <View style={styles.headingInnerContainer}>
          <View style={{ flexDirection: "column", marginRight: wp(30) }}>
            <Text style={styles.headingText}>Currency</Text>
            <Text style={styles.headingText}>Converter</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="settings" size={30} color="#008170" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text
          style={{
            fontSize: 20,
            color: "#fff",
            fontFamily: "Avenir Next",
            fontWeight: "bold",
          }}
        >
          Amount:
        </Text>
        <TextInput
          style={{
            height: 40,
            borderColor: "#008170",
            borderWidth: 2,
            width: 200,
            borderRadius: 10,
            padding: 10,
            color: "#fff",
            fontFamily: "Avenir Next",
            fontWeight: "bold",
          }}
          placeholderTextColor={"#fff"}
          keyboardType="numeric"
          onChangeText={(text) => setAmount(text)}
          value={amount}
        />
      </View>

      <View style={{ marginBottom: 10 }}>
        <View style={styles.fromContainer}>
          <TouchableOpacity onPress={handleOpenFromCurrencyModal}>
            <Text
              style={{
                color: "#fff",
                fontFamily: "Avenir Next",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              From: {fromCurrency}
            </Text>
          </TouchableOpacity>
        </View>

        {selectFromCurrencyModalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={selectFromCurrencyModalVisible}
            onRequestClose={() => setSelectFromCurrencyModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Currency</Text>
                <Picker
                  selectedValue={fromCurrency}
                  style={styles.picker}
                  onValueChange={(itemValue: string) =>
                    handleConfirmFromCurrency(itemValue)
                  }
                >
                  {ratesFetched &&
                    Object.keys(rates!).map((currency, index) => (
                      <Picker.Item
                        key={index}
                        label={currency}
                        value={currency}
                      />
                    ))}
                </Picker>
                <TouchableOpacity
                  style={styles.okButton}
                  onPress={() => setSelectFromCurrencyModalVisible(false)}
                >
                  <Text style={styles.okButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>

      <View style={{ marginBottom: 10 }}>
        <View style={styles.toContainer}>
          <TouchableOpacity onPress={handleOpenToCurrencyModal}>
            <Text
              style={{
                color: "#fff",
                fontFamily: "Avenir Next",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              To: {toCurrency}
            </Text>
          </TouchableOpacity>
        </View>

        {selectToCurrencyModalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={selectToCurrencyModalVisible}
            onRequestClose={() => setSelectToCurrencyModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Currency</Text>
                <Picker
                  selectedValue={toCurrency}
                  style={styles.picker}
                  onValueChange={(itemValue: string) =>
                    handleConfirmToCurrency(itemValue)
                  }
                >
                  {ratesFetched &&
                    Object.keys(rates!).map((currency, index) => (
                      <Picker.Item
                        key={index}
                        label={currency}
                        value={currency}
                      />
                    ))}
                </Picker>
                <TouchableOpacity
                  style={styles.okButton}
                  onPress={() => setSelectToCurrencyModalVisible(false)}
                >
                  <Text style={styles.okButtonText}>Select</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>

      <View style={styles.calculateButton}>
        <TouchableOpacity onPress={calculateOutput}>
          <Text
            style={{
              color: "#005B41",
              fontFamily: "Avenir Next",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Calculate
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.output}>
        <Text
          style={{
            color: "#008170",
            fontFamily: "Avenir Next",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          Output: {output}
        </Text>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headingContainer: {
    width: wp(95),
    backgroundColor: "#232D3F",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: hp(13),
  },
  headingInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headingText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginRight: 20,
    fontFamily: "Avenir Next",
  },
  amountContainer: {
    width: wp(95),
    backgroundColor: "#232D3F",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    height: hp(20),
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  fromContainer: {
    width: wp(95),
    backgroundColor: "#232D3F",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    height: hp(10),
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  toContainer: {
    width: wp(95),
    backgroundColor: "#232D3F",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    height: hp(10),
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  calculateButton: {
    width: wp(70),
    backgroundColor: "#232D3F",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    height: hp(10),
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp(1),
  },
  output: {
    width: wp(95),
    backgroundColor: "#232D3F",
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    height: hp(10),
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: hp(2),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#005B41",
    padding: 20,
    borderRadius: 10,
    width: wp(95),
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picker: {
    backgroundColor: "#005B41",
    width: wp(80),
    alignSelf: "center",
    marginBottom: 20,
  },
  okButton: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    width: wp(30),
  },
  okButtonText: {
    color: "#000",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
