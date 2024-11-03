import React, {useEffect} from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import Logo1 from '../assets/images/2.jpg';
import Logo2 from '../assets/images/balucuc.jpg';


interface ReceiptPDFProps {
  title: string;
  data: { [key: string]: string | number };
  headerText?: { h1?: string; h2?: string; h3?: string };
}



const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '90%',
    marginHorizontal: 'auto',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  headerText1:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 2,
  },
  headerText2: {
    fontSize: 12,
    textAlign: 'center',
    margin: 2,
    color: '#000000',
  },
  logo: {
    width:70,
    height:70,
  },
  header: {
    marginBottom: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 10,
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  fieldLabel: {
    width: '35%',
    fontWeight: 'bold',
  },
  fieldValue: {
    width: '65%',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
  },
});

const capitalizeAndFormatLabel = (label: string) => {
    // Handle specific renaming for certain fields like created_at and updated_at
    const specialLabels: { [key: string]: string } = {
      created_at: 'Created Date',
      updated_at: 'Updated Date',
    };

    // If the label is one of the special fields, return the mapped value
    if (specialLabels[label]) {
      return specialLabels[label];
    }

    return label
      .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase to normal case
      .replace(/_/g, ' ') // snake_case to normal case
      .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};


const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ title, data, headerText }) => {


  useEffect(() => {
    console.log('ReceiptPDF component mounted');
    console.log('Title:', title);
    console.log('Data:', data);
    console.log('Header Text:', headerText);
  }, [])

  const renderFields = () => {
    return Object.keys(data).map((key) => (
      <View style={styles.fieldContainer} key={key}>
        <Text style={styles.fieldLabel}>
          {capitalizeAndFormatLabel(key)}:
        </Text>
        <Text style={styles.fieldValue}>
          {/* Format date fields */}
          {key.includes('created_at') || key.includes('updated_at')
            ? formatDate(data[key] as string)
            : data[key]}
        </Text>
      </View>
    ));
  };

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          {/* Left Logo */}
          <Image src={Logo1} style={styles.logo} />

          {/* Centered Header Content */}
          <View style={styles.headerContent}>
            <Text style={styles.headerText1}>{headerText?.h1 || ''}</Text>
            <Text style={styles.headerText2}>{headerText?.h2 || ''}</Text>
            <Text style={styles.headerText2}>{headerText?.h3 || ''}</Text>
             {/* Title */}
          </View>
          {/* Right Logo */}
          <Image src={Logo2} style={styles.logo} />
        </View>

        <View style={styles.divider} />
        <Text style={styles.header}>{title} Receipt</Text>
        <View style={styles.section}>{renderFields()}</View>
        <View style={styles.divider} />
        {/* <Text style={styles.footer}>Thank you!</Text> */}
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
