import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { useUser } from "./User";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  borderContainer: {
    border: "2px solid black",
    flex: 1,
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 700,
    marginRight: 10,
  },
  logo: { width: 100, height: 100, borderRadius: 100, marginLeft: 30 },
  header: {
    borderBottom: "2px solid black",
    width: "563pt",
    flexDirection: "row",
    paddingVertical: 5,
  },
  headerText: {
    fontSize: 18,
    marginTop: -10,
    marginBottom: 15,
  },
  headerTextUnder1: {
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 65,
    letterSpacing: -0.5,
    fontWeight: 500,
  },
  headerTextUnder2: { fontSize: 12, letterSpacing: -0.5, fontWeight: 500 },
  secondContainer: { flexDirection: "row" },
  headerBody: {
    marginRight: 50,
  },
  nameBody: {
    flexDirection: "row",
    borderRight: "2px solid black",
    borderBottom: "2px solid black",
    paddingBottom: 50,
  },
  statusText: { paddingRight: 5, paddingLeft: 5 },
  status: {
    borderRight: "2px solid black",
    borderBottom: "2px solid black",
    paddingBottom: 50,
  },
  sexText: {
    marginHorizontal: 20,
  },
  sex: {
    borderBottom: "2px solid black",
    paddingBottom: 50,
  },
  chooseSex: {
    position: "absolute",
    top: 25,
    left: 10,
  },
  thirdRow: {
    flexDirection: "row",
  },
  addressCon: {
    borderRight: "2px solid black",
    borderBottom: "2px solid black",
    width: 342,
    flexDirection: "column",
  },
  addressText: {
    marginVertical: 10,
  },
  mobAndDobCon: {
    borderBottom: "2px solid black",
  },
  mob: {
    borderBottom: "2px solid black",
    width: 220,
  },
  Dob: {},
  broughtby: {
    marginRight: 10,
    paddingBottom: 20,
  },
  ambulance: { marginLeft: -20, marginRight: 22 },
  broughtCon: {
    borderRight: "2px solid black",
    borderBottom: "2px solid black",
    flexDirection: "row",
    width: 342,
  },
  dat: {
    borderBottom: "1px solid black",
    width: 220,
    marginBottom: 2,
  },
  name: {
    position: "absolute",
    top: 25,
    fontSize: 16,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    marginLeft: 2,
  },
  firstname: {
    position: "absolute",
    top: 25,
    fontSize: 16,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    left: -10,
    textAlign: "center",
  },
  statusans: {
    position: "absolute",
    top: 25,
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    marginLeft: 2,
  },
  addressans: {
    position: "absolute",
    top: 5,
    left: 50,
    width: 292,
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    marginLeft: 2,
  },
  phoneans: {
    position: "absolute",
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    left: 63,
  },
  dobans: {
    position: "absolute",
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    left: 77,
  },
  philnum: {
    position: "absolute",
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    left: 112,
  },
  phicname: {
    position: "absolute",
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    left: 112,
    top: 5,
    width: 110,
  },
  datans: {
    position: "absolute",
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    left: 30,
    width: 100,
  },
  briefHistoryText: {
    position: "absolute",
    fontSize: 12,
    letterSpacing: -0.9,
    fontFamily: "Roboto",
    fontWeight: 500,
    marginLeft: 78,
    marginTop: 10,
  },
});
const PDFFile = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.borderContainer}>
          {/* firstrow */}
          <View style={styles.header}>
            <Image style={styles.logo} src="images/3.jpg" />
            <View style={styles.section}>
              <Text style={styles.headerText}>
                APALIT RURAL HEALTH UNIT III
              </Text>
              <Text style={styles.headerTextUnder1}>
                MUNICIPALITY OF APALIT
              </Text>
              <Text style={styles.headerTextUnder2}>
                VILLENA SUBDIVISION SAN VICENTE APALIT, PAMPANGA
              </Text>
            </View>
          </View>
          {/* firstrow */}

          {/* secondrow */}
          <View style={styles.secondContainer}>
            <View style={styles.nameBody}>
              <View>
                <Text style={styles.headerBody}>FAMILY NAME:</Text>
                <Text style={styles.name}>Lasaro</Text>
              </View>
              <View>
                <Text style={styles.headerBody}>FIRST NAME:</Text>
                <Text style={styles.firstname}>Mark</Text>
              </View>
              <View>
                <Text style={styles.headerBody}>MIDDLE NAME:</Text>
                <Text style={styles.name}>Kram</Text>
              </View>
            </View>
            <View style={styles.status}>
              <Text style={styles.statusText}>STATUS:</Text>
              <Text style={styles.statusans}>Single</Text>
            </View>
            <View style={styles.status}>
              <Text style={styles.statusText}>NATIONALITY:</Text>
              <Text style={styles.name}>Filipino</Text>
            </View>
            <View style={styles.status}>
              <Text style={styles.statusText}>AGE:</Text>
              <Text style={styles.statusans}>21</Text>
            </View>
            <View style={styles.sex}>
              <Text style={styles.sexText}>SEX:</Text>
              <Text style={styles.chooseSex}>M(/) F( )</Text>
            </View>
          </View>
          {/* secondrow */}

          {/* thirdrow */}
          <View style={styles.thirdRow}>
            <View style={styles.addressCon}>
              <Text style={styles.addressText}>ADDRESS:</Text>
              <Text style={styles.addressans}>
                Phase 3 Block 11 Lot 4A Vancouver Street Highview Hills
                Subdivision Sampaloc Apalit
              </Text>
            </View>
            <View style={styles.mobAndDobCon}>
              <View>
                <Text style={styles.mob}>MOBILE NO.:</Text>
                <Text style={styles.phoneans}>09123456789</Text>
              </View>
              <View>
                <Text style={styles.Dob}>DATE OF BIRTH:</Text>
                <Text style={styles.dobans}>December 31, 2003</Text>
              </View>
            </View>
          </View>
          {/* thirdrow */}
          {/* fourthrow */}
          <View style={{ flexDirection: "row" }}>
            <View style={styles.broughtCon}>
              <Text style={styles.broughtby}>BROUGHT BY:</Text>
              <View>
                <Text style={styles.broughtby}>(/) SELF</Text>
                <Text style={{ marginRight: 10 }}>( ) RELATIVES</Text>
              </View>
              <View>
                <Text
                  style={{
                    marginLeft: -30,
                    paddingBottom: 20,
                  }}
                >
                  ( ) POLICE
                </Text>
                <Text>( ) OTHER</Text>
              </View>
              <View>
                <Text style={styles.ambulance}>( ) AMBULANCE</Text>
              </View>
            </View>
            <View
              style={{
                width: 220,
                borderBottom: "2px solid black",
              }}
            >
              <View>
                <View style={{ borderBottom: "2px solid black" }}>
                  <Text
                    style={{
                      marginLeft: 60,
                    }}
                  >
                    PHILHEALTH MEMBER
                  </Text>
                  <Text
                    style={{
                      marginLeft: 80,
                    }}
                  >
                    YES(/) NO ( )
                  </Text>
                </View>
              </View>
              <View>
                <Text>PHILHEALTH NUMBER:</Text>
                <Text style={styles.philnum}>17-132456789-0</Text>
              </View>
            </View>
          </View>
          {/* fourthrow */}
          {/* fifthrow */}
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                borderBottom: "2px solid black",
                borderRight: "2px solid black",
                width: 342,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderBottom: "2px solid black",

                  width: 342,
                }}
              >
                <Text>DATE: </Text>
                <Text style={styles.datans}>July 29, 2024</Text>
                <Text style={styles.dat}></Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Text>TIME:</Text>
                <Text style={styles.datans}>12:30 am</Text>
                <Text style={styles.dat}></Text>
              </View>
            </View>
            <View
              style={{
                width: 220,
                borderBottom: "2px solid black",
              }}
            >
              <Text style={{ paddingVertical: 10 }}>PHIC MEMBER NAME:</Text>
              <Text style={styles.phicname}>Mark Kram Lasaro</Text>
            </View>
          </View>
          {/* fifthrow */}
          {/* sixthrow */}
          <View style={{ height: 100, borderBottom: "2px solid black" }}>
            <Text>CHIEF COMPLAINTS:</Text>
            <Text
              style={{
                position: "absolute",
                top: 15,

                fontSize: 12,
                letterSpacing: -0.9,
                fontFamily: "Roboto",
                fontWeight: 500,
              }}
            >
              Fever, Cough
            </Text>
          </View>
          {/* sixthrow */}
          {/* seventhrow */}
          <View style={{ height: 80, borderBottom: "2px solid black" }}>
            <Text style={{ marginVertical: 30 }}>BRIEF HISTORY:</Text>
            <Text style={styles.briefHistoryText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
              venenatis enim. Suspendisse potenti. Integer ac bibendum elit.
              Cras et leo ut lorem ullamcorper fermentum sed vel lacus. Duis nec
              odio nisl. Suspendisse in neque ac orci venenatis pharetra. Sed eu
              dui quis velit pharetra vehicula non at est. Curabitur in justo
              sit amet magna dignissim tristique nec quis odio.
            </Text>
          </View>
          {/* seventhrow */}
          {/* eighthrow */}
          <View
            style={{
              paddingVertical: 1,
              borderBottom: "2px solid black",
            }}
          >
            <Text
              style={{
                marginLeft: 220,
              }}
            >
              PHYSICAL EXAMINATION:
            </Text>
          </View>
          {/* eighthrow */}
          {/* ninthrow */}
          <View
            style={{
              flexDirection: "row",
              borderBottom: "2px solid black",
            }}
          >
            <Text
              style={{
                width: 110,
                borderRight: "2px solid black",
                paddingVertical: 2,
              }}
            >
              VS:BP:
            </Text>

            <Text
              style={{
                width: 100,
                borderRight: "2px solid black",
                paddingVertical: 2,
              }}
            >
              HR:
            </Text>
            <Text
              style={{
                width: 80,
                borderRight: "2px solid black",
                paddingVertical: 2,
              }}
            >
              PR:
            </Text>
            <Text
              style={{
                width: 100,
                borderRight: "2px solid black",
                paddingVertical: 2,
              }}
            >
              T:
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: 90,
                  paddingVertical: 2,
                }}
              >
                WT
              </Text>
              <Text style={{ paddingVertical: 2 }}>H</Text>
            </View>
          </View>
          {/* ninthrow */}
          {/* tenthrow */}
          <View style={{ borderBottom: "2px solid black", height: 80 }}>
            <Text>DIAGNOSIS</Text>
          </View>
          {/* tenthrow */}
          {/* eleventhrow */}
          <View>
            <Text>DOCTOR'S ORDER:</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                top: 130,
              }}
            >
              <Text
                style={{
                  borderBottom: "2px solid black",
                  width: 200,
                }}
              ></Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                top: 143,
              }}
            >
              <Text>PRINTED NAME & SIGNATURE (RESIDENT)</Text>
            </View>
          </View>
          {/* eleventhrow */}
        </View>
      </Page>
    </Document>
  );
};

export default PDFFile;
